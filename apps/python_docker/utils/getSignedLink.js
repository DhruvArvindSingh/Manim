import cloudfront from 'aws-cloudfront-sign';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

const __dirname = path.resolve();

dotenv.config();

function getSignedLink(slug) {
    try {
        const privateKeyString = fs.readFileSync(path.join(__dirname, 'cloudfront_auth/private_key.pem'), 'utf8');

        // Check if this is a placeholder key
        if (privateKeyString.includes('PLACEHOLDER_PRIVATE_KEY_FOR_DEVELOPMENT_ONLY')) {
            console.log("Warning: Using placeholder CloudFront key, returning proxy URL");
            // Return video proxy URL to avoid CORS issues
            const proxyUrl = process.env.VIDEO_PROXY_URL || 'http://localhost:3033';
            return `${proxyUrl}/video/${slug}`;
        }

        // Replace YOUR_NEW_CLOUDFRONT_DOMAIN with your actual CloudFront distribution domain
        // Example: d1234567890123.cloudfront.net
        const signedUrl = cloudfront.getSignedUrl(
            `https://${process.env.CLOUDFRONT_DOMAIN || 'YOUR_NEW_CLOUDFRONT_DOMAIN.cloudfront.net'}/__main/${slug}.mp4`,
            {
                keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
                privateKeyString: privateKeyString,
                expireTime: Date.now() + (10 * 60 * 1000) // 10 minutes from now in milliseconds
            }
        );

        return signedUrl;
    } catch (error) {
        console.error("CloudFront signing failed, falling back to proxy URL:", error.message);
        // Fallback to video proxy URL to avoid CORS issues
        const proxyUrl = process.env.VIDEO_PROXY_URL || 'http://localhost:3033';
        return `${proxyUrl}/video/${slug}`;
    }
}

export default getSignedLink;
