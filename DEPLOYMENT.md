# Pichuka Restaurant - Deployment Guide

This guide provides step-by-step instructions for deploying the Pichuka Restaurant application in a production environment.

## Prerequisites

- Docker and Docker Compose installed on the server
- A domain name (optional but recommended for production)
- SSL certificates (if using HTTPS)

## 1. Environment Setup

### Backend Environment

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb://pichuka:pichuka123@mongodb:27017/RESTAURANT?authSource=admin

# JWT
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://yourdomain.com

# Security
RATE_LIMIT_WINDOW_MS=60 * 60 * 1000  # 1 hour
RATE_LIMIT_MAX=100  # 100 requests per window
```

### Frontend Environment

Create a `.env.production` file in the `WebFrontend` directory:

```env
VITE_API_BASE_URL=/api
VITE_APP_TITLE="Pichuka Restaurant"
VITE_APP_DESCRIPTION="Multi-Cuisine Restaurant Booking System"
NODE_ENV=production
```

## 2. Building and Running with Docker Compose

1. Navigate to the `deploy` directory:
   ```bash
   cd deploy
   ```

2. Create a `.env` file for Docker Compose:
   ```env
   # MongoDB
   MONGO_INITDB_ROOT_USERNAME=root
   MONGO_INITDB_ROOT_PASSWORD=secure_password_here
   MONGO_INITDB_DATABASE=RESTAURANT
   
   # Backend
   JWT_SECRET=your_secure_jwt_secret_here
   
   # Frontend
   VITE_API_BASE_URL=/api
   ```

3. Start the services:
   ```bash
   docker-compose up -d --build
   ```

4. Verify the containers are running:
   ```bash
   docker-compose ps
   ```

## 3. Configuring Nginx (Optional)

If you're using the included Nginx configuration, update the `deploy/nginx/nginx.conf` file with your domain name and SSL certificate paths.

## 4. Setting Up SSL (Recommended)

1. Obtain SSL certificates using Let's Encrypt:
   ```bash
   certbot certonly --standalone -d yourdomain.com
   ```

2. Update the Nginx configuration to use the certificates.

## 5. Monitoring and Maintenance

### Logs

View logs for all services:
```bash
docker-compose logs -f
```

View specific service logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Backups

Set up regular backups for MongoDB:
```bash
# Backup command
docker exec -t pichuka-mongodb mongodump --out /data/backup/$(date +%Y%m%d)

# Restore command
docker exec -i pichuka-mongodb mongorestore --drop /data/backup/20230807/
```

## 6. Updating the Application

1. Pull the latest changes
2. Rebuild and restart the services:
   ```bash
   docker-compose up -d --build
   ```

## 7. Environment Variables Reference

### Backend
- `NODE_ENV`: Application environment (production/development)
- `PORT`: Port to run the backend server on
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWTs
- `JWT_EXPIRES_IN`: JWT expiration time
- `FRONTEND_URL`: Allowed frontend URL for CORS

### Frontend
- `VITE_API_BASE_URL`: Base URL for API requests
- `VITE_APP_TITLE`: Application title
- `VITE_APP_DESCRIPTION`: Application description

## 8. Troubleshooting

### Common Issues

1. **MongoDB connection issues**:
   - Check if MongoDB is running
   - Verify credentials in the connection string
   - Check network connectivity between containers

2. **CORS errors**:
   - Ensure `FRONTEND_URL` is correctly set
   - Check if the frontend URL is included in the allowed origins

3. **Build failures**:
   - Check for syntax errors in the code
   - Verify all dependencies are installed
   - Check Docker build logs for specific errors

### Getting Help

If you encounter any issues, please check the logs and refer to the application documentation. For additional support, please contact the development team.

## 9. Security Considerations

1. **Secrets Management**:
   - Never commit sensitive information to version control
   - Use environment variables or a secrets management service
   - Rotate secrets regularly

2. **Firewall**:
   - Only expose necessary ports to the internet
   - Use a Web Application Firewall (WAF)

3. **Updates**:
   - Keep all dependencies up to date
   - Regularly update Docker images
   - Monitor for security vulnerabilities
