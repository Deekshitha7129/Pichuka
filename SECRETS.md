# Pichuka Restaurant - Secrets and Manual Setup Guide

This document contains sensitive information required for deploying and configuring the Pichuka Restaurant application. Keep this file secure and never commit it to version control.

## Required Secrets

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://username:password@localhost:27017/RESTAURANT?authSource=admin

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
RATE_LIMIT_MAX=100  # 100 requests per window
```

### Frontend Environment Variables

Create a `.env.production` file in the `WebFrontend` directory:

```env
# API Configuration
VITE_API_BASE_URL=/api

# Application
VITE_APP_TITLE="Pichuka Restaurant"
VITE_APP_DESCRIPTION="Multi-Cuisine Restaurant Booking System"

# Environment
NODE_ENV=production
```

## GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets > Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_PRIVATE_KEY` | Private SSH key for deployment server | `-----BEGIN RSA PRIVATE KEY-----...` |
| `SSH_KNOWN_HOSTS` | Known hosts for the deployment server | `github.com ssh-rsa AAAAB3...` |
| `SSH_USER` | SSH username for deployment | `deploy` |
| `SSH_HOST` | Server IP or hostname | `123.456.789.10` |
| `SSH_PORT` | SSH port (optional, default: 22) | `22` |
| `MONGODB_URI` | Production MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs | `your_secure_jwt_secret_here` |
| `FRONTEND_URL` | Production frontend URL | `https://yourdomain.com` |

## Server Setup

### 1. Prerequisites

- Ubuntu 20.04/22.04 LTS server
- Docker and Docker Compose installed
- Domain name pointing to server IP
- Firewall configured (ports 22, 80, 443, 5000)

### 2. Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Nginx (if not using Docker)
sudo apt install -y nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Set up automatic renewal
echo "0 0,12 * * * root python3 -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

## Deployment Steps

### 1. Clone the Repository

```bash
# Create project directory
mkdir -p ~/pichuka && cd ~/pichuka

# Clone the repository
git clone https://github.com/yourusername/pichuka-restaurant.git .
```

### 2. Set Up Environment Files

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env  # Edit with your values

# Frontend
cp WebFrontend/.env.example WebFrontend/.env.production
nano WebFrontend/.env.production  # Edit with your values
```

### 3. Start the Application

```bash
# Start all services
docker-compose -f deploy/docker-compose.yml up -d

# View logs
docker-compose -f deploy/docker-compose.yml logs -f
```

## Post-Deployment Tasks

### 1. Verify Services

Check if all containers are running:
```bash
docker ps
```

### 2. Set Up Backups

Create a backup script at `~/backup.sh`:
```bash
#!/bin/bash

# Create backup directory
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Dump MongoDB
mongodump --uri="$MONGO_URI" --out=$BACKUP_DIR/mongodb

# Backup Docker volumes
docker run --rm -v pichuka_mongodb_data:/source -v $BACKUP_DIR:/backup alpine tar czf /backup/mongodb_data.tar.gz -C /source .

# Keep only last 7 days of backups
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

Make it executable and set up a cron job:
```bash
chmod +x ~/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -
```

## Monitoring and Maintenance

### 1. View Logs

```bash
# Backend logs
docker logs -f pichuka-backend

# Frontend logs
docker logs -f pichuka-frontend

# MongoDB logs
docker logs -f pichuka-mongodb
```

### 2. Update the Application

```bash
# Pull latest changes
cd ~/pichuka
git pull

# Rebuild and restart containers
docker-compose -f deploy/docker-compose.yml up -d --build
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Verify MongoDB is running: `docker ps | grep mongo`
   - Check connection string format
   - Verify authentication credentials

2. **Port Conflicts**
   - Check if ports are in use: `sudo lsof -i -P -n | grep LISTEN`
   - Update port mappings in `docker-compose.yml` if needed

3. **Container Not Starting**
   - Check logs: `docker logs [container_name]`
   - Verify environment variables
   - Check disk space: `df -h`

4. **SSL Certificate Issues**
   - Check certificate expiration: `sudo certbot certificates`
   - Renew certificates: `sudo certbot renew --dry-run`

## Security Best Practices

1. **Regular Updates**
   - Update system packages regularly
   - Rebuild Docker images with security updates
   - Rotate secrets periodically

2. **Access Control**
   - Use SSH key authentication only
   - Disable root login
   - Implement fail2ban for SSH protection

3. **Monitoring**
   - Set up log rotation
   - Monitor disk space and system resources
   - Set up alerts for critical services

4. **Backup Verification**
   - Regularly test backup restoration
   - Store backups in multiple locations
   - Encrypt sensitive backup data

## Support

For additional support, please contact the development team or open an issue in the repository.
