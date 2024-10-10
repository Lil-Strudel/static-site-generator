import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import mime from 'mime';

async function uploadFolderToS3(folderPath: string, bucketName: string, prefix: string = "", client: S3Client) {
    const items = fs.readdirSync(folderPath); 
  
    for (const item of items) {
      const fullPath = path.join(folderPath, item);  
      const s3Key = path.join(prefix, item).replace(/\\/g, '/'); 
  
      if (fs.statSync(fullPath).isDirectory()) {
        await uploadFolderToS3(fullPath, bucketName, s3Key, client);
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

  export default uploadFolderToS3;