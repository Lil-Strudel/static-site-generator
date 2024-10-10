import { BucketLocationConstraint, CreateBucketCommand, ObjectOwnership, PutBucketPolicyCommand, PutBucketWebsiteCommand, PutPublicAccessBlockCommand, S3Client } from "@aws-sdk/client-s3";

async function createBucketWithPublicAccess(bucket: string, client: S3Client, region = "us-west-2"): Promise<string>{
    const randomString = Math.random().toString(36).slice(2, 12)
        const newBucketName = `ssg-${bucket}-${randomString.toLowerCase()}`
        const createBucketInput = { 
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
        } 

    return newBucketName
}

export default createBucketWithPublicAccess