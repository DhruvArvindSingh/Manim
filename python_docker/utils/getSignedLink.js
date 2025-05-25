import cloudfront from 'aws-cloudfront-sign';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

const __dirname = path.resolve();

dotenv.config();

function getSignedLink(slug) {
    const privateKeyString = fs.readFileSync(path.join(__dirname, 'cloudfront_auth/private_key.pem'), 'utf8');

    const signedUrl = cloudfront.getSignedUrl(
        `https://d1v9ua0rugj7lf.cloudfront.net/__main/${slug}.mp4`,
        {
            keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
            privateKeyString: privateKeyString,
            expireTime: Date.now() + (10 * 60 * 1000) // 10 minutes from now in milliseconds
        }
    );

    return signedUrl;
}

export default getSignedLink;
