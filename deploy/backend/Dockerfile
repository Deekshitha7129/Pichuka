# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Bundle app source
COPY backend/ .

# Create logs directory
RUN mkdir -p logs

# Expose the app port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]
