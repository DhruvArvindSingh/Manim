import express from 'express';
import cors from 'cors';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Readable } from 'stream';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.VIDEO_PROXY_PORT || 3033;

// Configure CORS
app.use(cors({
    origin: [
        'http://animath.dsingh.fun',
        'https://animath.dsingh.fun',
        'http://localhost:3000'
    ],
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Range']
}));

// Create S3 client
const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

// Video proxy endpoint
app.get('/video/:slug', async (req, res) => {
    const { slug } = req.params;
    const key = `__main/${slug}.mp4`;

    try {
        // Get the video from S3
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });

        const { Body, ContentLength, ContentType, LastModified } = await s3Client.send(command);

        if (!Body) {
            return res.status(404).send('Video not found');
        }

        // Set headers
        res.setHeader('Content-Type', ContentType || 'video/mp4');
        res.setHeader('Content-Length', ContentLength);
        res.setHeader('Last-Modified', LastModified?.toUTCString());
        res.setHeader('Cache-Control', 'public, max-age=31536000');

        // Stream the video to the client
        const stream = Body instanceof Readable ? Body : Readable.from(Body);
        stream.pipe(res);

    } catch (error) {
        console.error('Error streaming video:', error);
        res.status(500).send('Error streaming video');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Video proxy server running on port ${PORT}`);
});