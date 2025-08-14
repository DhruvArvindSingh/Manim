import { CloudFrontClient, GetDistributionConfigCommand, UpdateDistributionCommand } from '@aws-sdk/client-cloudfront';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const cloudfrontClient = new CloudFrontClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

async function configureCloudFrontCORS() {
    try {
        // Get the current distribution config
        const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;

        if (!distributionId) {
            console.error("CLOUDFRONT_DISTRIBUTION_ID not found in environment variables");
            return;
        }

        const getConfigCommand = new GetDistributionConfigCommand({
            Id: distributionId
        });

        const { DistributionConfig, ETag } = await cloudfrontClient.send(getConfigCommand);

        // Update the distribution config to forward CORS headers
        // Find the default cache behavior
        const defaultBehavior = DistributionConfig.DefaultCacheBehavior;

        // Create a list of headers to forward if it doesn't exist
        if (!defaultBehavior.ForwardedValues.Headers) {
            defaultBehavior.ForwardedValues.Headers = {
                Quantity: 0,
                Items: []
            };
        }

        // Add CORS headers to forward
        const corsHeaders = [
            'Access-Control-Request-Headers',
            'Access-Control-Request-Method',
            'Origin'
        ];

        const currentHeaders = defaultBehavior.ForwardedValues.Headers.Items || [];

        // Add CORS headers if they don't already exist
        corsHeaders.forEach(header => {
            if (!currentHeaders.includes(header)) {
                currentHeaders.push(header);
            }
        });

        // Update the headers configuration
        defaultBehavior.ForwardedValues.Headers = {
            Quantity: currentHeaders.length,
            Items: currentHeaders
        };

        // Update the distribution
        const updateCommand = new UpdateDistributionCommand({
            Id: distributionId,
            IfMatch: ETag,
            DistributionConfig: DistributionConfig
        });

        const response = await cloudfrontClient.send(updateCommand);
        console.log("CloudFront CORS configuration updated successfully:", response.Distribution.Id);

        return response;
    } catch (error) {
        console.error("Error configuring CloudFront CORS:", error);
        throw error;
    }
}

// Run the configuration
configureCloudFrontCORS().then(() => {
    console.log("CloudFront CORS configuration completed");
}).catch(err => {
    console.error("Failed to configure CloudFront CORS:", err);
});