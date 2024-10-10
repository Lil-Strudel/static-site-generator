import { 
  S3Client, 
  PutBucketPolicyCommand, 
  PutObjectCommand, 
  ListBucketsCommand, 
  CreateBucketCommand, 
  Bucket, 
  BucketLocationConstraint, 
  ObjectOwnership, 
  PutBucketWebsiteCommand, 
  PutPublicAccessBlockCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  ListObjectsV2CommandOutput
} from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import mime from 'mime';


const region = process.env.REGION  || "us-west-2"

const client = new S3Client({
    region: region,
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
        accessKeyId: process.env.ACCESS_KEY || ""
    },
}
);

async function runClientCommand(command){
  try {
    await client.send(command); 
    console.log(`Successfully ran AWS command ${command.name}`);
  } catch (err) {
    console.error(`Error running command ${command.name}:`, err);
  }
}


async function uploadFolderToS3(folderPath: string, bucketName: string, prefix: string = "") {
  const items = fs.readdirSync(folderPath); 

  for (const item of items) {
    const fullPath = path.join(folderPath, item);  
    const s3Key = path.join(prefix, item).replace(/\\/g, '/'); 

    if (fs.statSync(fullPath).isDirectory()) {
      await uploadFolderToS3(fullPath, bucketName, s3Key);
    } else {
      const fileContent = fs.readFileSync(fullPath); 
      const contentType = mime.getType(fullPath) || 'application/octet-stream';

      const uploadParams = {
        Bucket: bucketName,
        Key: s3Key,  
        Body: fileContent,
        ContentType: contentType,
      };

      try {
        const command = new PutObjectCommand(uploadParams);
        await client.send(command); 
        console.log(`Successfully uploaded ${fullPath} to ${bucketName}/${s3Key}`);
      } catch (err) {
        console.error(`Error uploading ${fullPath}:`, err);
      }
    }
  }
}

async function deleteAllObjectsInBucket(bucketName: string) {
  let isTruncated = true;
  let continuationToken: string | undefined = undefined;

  try {
    while (isTruncated) {
      const listParams = {
        Bucket: bucketName,
        ContinuationToken: continuationToken, 
      };

      const listObjectsCommand = new ListObjectsV2Command(listParams);
      const listObjectsOutput = await client.send(listObjectsCommand) as ListObjectsV2CommandOutput;

      const objects = listObjectsOutput.Contents;

      if (!objects || objects.length === 0) {
        console.log('No objects found in the bucket');
        return;
      }

      const deleteParams: DeleteObjectsCommandInput = {
        Bucket: bucketName,
        Delete: {
          Objects: objects.map((object) => ({ Key: object.Key! })), 
        },
      };

      const deleteObjectsCommand = new DeleteObjectsCommand(deleteParams);
      const deleteObjectsOutput = await client.send(deleteObjectsCommand);

      console.log('Deleted objects:', deleteObjectsOutput.Deleted);

      isTruncated = listObjectsOutput.IsTruncated || false;
      continuationToken = listObjectsOutput.NextContinuationToken;
    }

    console.log(`All objects in bucket "${bucketName}" have been deleted`);
  } catch (error) {
    console.error('Error deleting objects:', error);
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
        if(splitBucket[1] === bucket){
            existing_bucket = buck
        }
    })

    if(!Object.keys(existing_bucket).length){
        const randomString = Math.random().toString(36).slice(2, 12)
        const newBucketName = `ssg-${bucket}-${randomString.toLowerCase()}`
        const createBucketInput = { 
            // ACL: "public-read" as BucketCannedACL, 
            Bucket: newBucketName, 
          
            CreateBucketConfiguration: { 
              LocationConstraint: region as BucketLocationConstraint, 
            },
            
            ObjectLockEnabledForBucket: false,  
            ObjectOwnership: "BucketOwnerEnforced" as ObjectOwnership,  
        };
          
        const createBucketCommand = new CreateBucketCommand(createBucketInput)
        console.log(`Creating New Bucket ${newBucketName}`)
    
        try {
            await client.send(createBucketCommand);
            console.log(`Bucket ${newBucketName} created successfully`)
          } catch (error) {
            console.error(error)
            return
        } 


        const publicAccessBlockInput = {
          Bucket: newBucketName,
          PublicAccessBlockConfiguration: {
              BlockPublicAcls: false,
              BlockPublicPolicy: false,
              IgnorePublicAcls: false,
              RestrictPublicBuckets: false,
          },
      };
      
      const putPublicAccessBlockCommand = new PutPublicAccessBlockCommand(publicAccessBlockInput);
      console.log('Disabling Public Access ')
      try {
          await client.send(putPublicAccessBlockCommand);
          console.log('Block Public Access disabled successfully');
      } catch (error) {
          console.error('Error disabling Block Public Access:', error);
      }

        const publicBucketPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${newBucketName}/*`,
                },
            ],
        };

        const putBucketPolicyInput = {
            Bucket: newBucketName,
            Policy: JSON.stringify(publicBucketPolicy),
        };

        const putBucketPolicyCommand = new PutBucketPolicyCommand(putBucketPolicyInput)
        console.log('Updating Bucket Policy to Be Public')
        try {
            const buckets_data  = await client.send(putBucketPolicyCommand);
            console.log('Enabled Bucket Policy to Public successfully')
          } catch (error) {
            console.error('Error updating bucket policy to public', error)
            return
        } 


        const publicConfig = {
            Bucket: newBucketName,
            WebsiteConfiguration: {
                IndexDocument: {
                    Suffix: 'index.html',
                },
                ErrorDocument: {
                    Key: '404.html',
                },
            },
        };

        const makeBucketPublic = new PutBucketWebsiteCommand(publicConfig)
        console.log(`Enabling Static Website Hosting ${newBucketName}`)
        try {
            await client.send(makeBucketPublic);
            console.log('Enabled Static Website Hosting successfully')
          } catch (error) {
            console.error('Error enabling static website hosting on bucket', error)
            return
        } 

        uploadFolderToS3('../generator/dist', newBucketName)
    }

    if(existing_bucket.Name){
        console.log(`Deleting all files in ${existing_bucket.Name} to regenerate page`)
        deleteAllObjectsInBucket(existing_bucket.Name);
        
        
        console.log(`Regenerating all files in ${existing_bucket.Name}`)
        uploadFolderToS3('../generator/dist', existing_bucket.Name)
    }
}



deploy('aaronslawncare')