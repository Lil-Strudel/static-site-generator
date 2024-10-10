import { 
  S3Client, 
  ListBucketsCommand, 
  Bucket, 
} from "@aws-sdk/client-s3";

import uploadFolderToS3 from "./s3/uploadFolderToS3";
import deleteAllObjectsInBucket from "./s3/deleteAllObjectsInBucket";
import createBucketWithPublicAccess from "./s3/createBucketWithPublicAccess";


const region = process.env.REGION  || "us-west-2"

const client = new S3Client({
    region: region,
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
        accessKeyId: process.env.ACCESS_KEY || ""
    },
}
);

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
        const newBucketName = await createBucketWithPublicAccess(bucket, client, region)

        uploadFolderToS3('../generator/dist', newBucketName, "", client)
    }

    if(existing_bucket.Name){
        console.log(`Deleting all files in ${existing_bucket.Name} to regenerate page`)
        deleteAllObjectsInBucket(existing_bucket.Name, client);
        
        
        console.log(`Regenerating all files in ${existing_bucket.Name}`)
        uploadFolderToS3('../generator/dist', existing_bucket.Name, "", client)
    }
}



deploy('aaronslawncare')