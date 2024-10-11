import { 
  S3Client, 
  ListBucketsCommand, 
  Bucket, 
} from "@aws-sdk/client-s3";

import {
  CloudFrontClient,
  CreateDistributionCommand,
  Method,
  MinimumProtocolVersion,
  OriginProtocolPolicy,
  PriceClass,
  SSLSupportMethod,
  ViewerProtocolPolicy,
} from "@aws-sdk/client-cloudfront";



import uploadFolderToS3 from "./s3/uploadFolderToS3";
import deleteAllObjectsInBucket from "./s3/deleteAllObjectsInBucket";
import createBucketWithPublicAccess from "./s3/createBucketWithPublicAccess";

const region = process.env.REGION  || "us-west-2"
const bucket_name = process.env.BUCKET_NAME || "jaxonslawncare"

const client = new S3Client({
    region: region,
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
        accessKeyId: process.env.ACCESS_KEY || ""
    },
});

const cloudFrontClient = new CloudFrontClient({ 
  region: "us-east-1",
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.ACCESS_KEY || ""
    },
});

async function createCloudFrontDistribution(bucketEndpoint) {
  const params = {
    DistributionConfig: {
      CallerReference: `unique-caller-reference-${Date.now()}`, // A unique string to ensure idempotency
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "S3-origin", // Unique ID for the origin
            DomainName: bucketEndpoint, // S3 bucket website endpoint
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "http-only" as OriginProtocolPolicy, // Choose 'http-only' or 'match-viewer'
            },
          },
        ],
      },
      DefaultCacheBehavior: {
        TargetOriginId: "S3-origin", // Matches the origin ID defined above
        ViewerProtocolPolicy: "redirect-to-https" as ViewerProtocolPolicy, // Forces HTTPS
        AllowedMethods: {
          Quantity: 2,
          Items: ["GET", "HEAD"] as Method[], // Only allow GET and HEAD requests
        },
        CachedMethods: {
          Quantity: 2,
          Items: ["GET", "HEAD"], // Only cache GET and HEAD requests
        },
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // Predefined CachingOptimized cache policy
        MinTTL: 0, // Minimum time-to-live for cache
      },
      ViewerCertificate: {
        ACMCertificateArn: "arn:aws:acm:us-east-1:539247450262:certificate/65a80fa1-5299-4efa-bd8b-50efc2447c1a", // Your ACM certificate ARN
        SSLSupportMethod: "sni-only" as SSLSupportMethod, // Most cost-effective SSL support
        MinimumProtocolVersion: "TLSv1.2_2021" as MinimumProtocolVersion, // Minimum supported TLS version
      },
      Comment: `CloudFront distribution for S3 bucket ${bucketEndpoint} with SSL`, // Optional comment
      Enabled: true, // Enable the distribution
      DefaultRootObject: "index.html", // Default object to serve from the bucket
      PriceClass: "PriceClass_100" as PriceClass, // Restrict distribution to North America and Europe
    },
  };

  try {
    const data = await cloudFrontClient.send(new CreateDistributionCommand(params));
    console.log("CloudFront Distribution Created:", data);
    return data
  } catch (err) {
    console.error("Error creating CloudFront distribution:", err);
  }
}

async function deploy(bucket: string): Promise<void>{

    const listBucketCommand = new ListBucketsCommand()
    let buckets: Bucket[] = []
    try {
        const buckets_data  = await client.send(listBucketCommand);
        buckets = buckets_data.Buckets || []
      } catch (error) {
        console.error(error)
        return
    } 

    let existing_bucket: Bucket = {}
    buckets.forEach((buck) => {
        let splitBucket = buck.Name?.split('-') || []
        const middleElements = splitBucket.slice(1, -1); 
        const joinedName = middleElements.join('-')

        if(joinedName === bucket){
            existing_bucket = buck
        }
    })

    if(!Object.keys(existing_bucket).length){
        const newBucketName = await createBucketWithPublicAccess(bucket, client, region)


        await uploadFolderToS3('../generator/dist', newBucketName, "", client)
        const s3Url = `http://${newBucketName}.s3-website-us-west-2.amazonaws.com`

        // console.log('Creating cloudfront distribution')
        // const distribution = await createCloudFrontDistribution(s3Url)
        // if(distribution){
        //   console.log(`cloudwatch domain name ${distribution.Distribution?.DomainName}`)
        // }
    }

    if(existing_bucket.Name){
        console.log(`Deleting all files in ${existing_bucket.Name} to regenerate page`)
        await deleteAllObjectsInBucket(existing_bucket.Name, client);
        
        
        console.log(`Regenerating all files in ${existing_bucket.Name}`)
        await uploadFolderToS3('../generator/dist', existing_bucket.Name, "", client)
    }
}



deploy(bucket_name)