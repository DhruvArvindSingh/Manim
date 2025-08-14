import { S3Client, GetBucketPolicyCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

async function checkBucketPolicy() {
    try {
        const command = new GetBucketPolicyCommand({
            Bucket: process.env.S3_BUCKET_NAME
        });

        const response = await s3Client.send(command);
        console.log("Current bucket policy:");
        console.log(JSON.stringify(JSON.parse(response.Policy), null, 2));
        return response;
    } catch (error) {
        if (error.name === 'NoSuchBucketPolicy') {
            console.log("No bucket policy exists. You may want to create one to allow public read access.");
        } else {
            console.error("Error checking bucket policy:", error);
        }
        throw error;
    }
}

// Run the check
checkBucketPolicy().then(() => {
    console.log("S3 bucket policy check completed");
}).catch(err => {
    if (err.name !== 'NoSuchBucketPolicy') {
        console.error("Failed to check S3 bucket policy:", err);
        process.exit(1);
    }
});