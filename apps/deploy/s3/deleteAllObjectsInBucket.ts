import { DeleteObjectsCommand, DeleteObjectsCommandInput, ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3";

async function deleteAllObjectsInBucket(bucketName: string, client: S3Client) {
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

  export default deleteAllObjectsInBucket
  