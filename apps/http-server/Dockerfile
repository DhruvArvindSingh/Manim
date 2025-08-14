# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .
COPY .env .env

# Build the TypeScript application
RUN npm run build

# Expose port 3000 (default) and allow override via environment
EXPOSE 3030
EXPOSE 3000
EXPOSE 3031

# Start the application
CMD ["npm", "start"] 