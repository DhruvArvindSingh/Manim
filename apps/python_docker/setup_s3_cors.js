import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';
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

async function configureCORS() {
    try {
        const corsParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["GET", "HEAD"],
                        AllowedOrigins: [
                            "http://animath.dsingh.fun",
                            "https://animath.dsingh.fun",
                            "http://localhost:3000"
                        ],
                        ExposeHeaders: ["ETag", "Content-Length", "Content-Type"],
                        MaxAgeSeconds: 3000
                    }
                ]
            }
        };

        const command = new PutBucketCorsCommand(corsParams);
        const response = await s3Client.send(command);

        console.log("CORS configuration successful:", response);
        return response;
    } catch (error) {
        console.error("Error configuring CORS:", error);
        throw error;
    }
}

// Run the configuration
configureCORS().then(() => {
    console.log("S3 bucket CORS configuration completed");
}).catch(err => {
    console.error("Failed to configure S3 bucket CORS:", err);
    process.exit(1);
});