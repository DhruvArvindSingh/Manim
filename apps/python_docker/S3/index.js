import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from "path";
import mime from 'mime';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.resolve();

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

async function uploadToS3(slug) {
    try {
        const filePath = path.join(__dirname, "media/videos/a/720p30/MainVideo.mp4");

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const fileContent = fs.readFileSync(filePath);

        console.log("Uploading file from:", filePath);

        const command = new PutObjectCommand({
            Bucket: `${process.env.S3_BUCKET_NAME}`,
            Key: `__main/${slug}.mp4`,
            Body: fileContent,
            ContentType: 'video/mp4', // Explicitly set for MP4 files
        });

        const response = await s3Client.send(command);
        console.log("Upload successful:", response);
        return response;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}

export default uploadToS3;