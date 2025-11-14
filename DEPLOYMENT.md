# Deployment Guide - Health Chatbot

Complete guide for deploying the Health Chatbot application to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] API keys securely stored
- [ ] SSL certificate ready
- [ ] Backup of current production
- [ ] Deployment plan documented

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Prerequisites

- Heroku account (https://www.heroku.com)
- Heroku CLI installed
- Git repository

#### Step 1: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Or use existing app
heroku apps:info your-app-name
```

#### Step 2: Add MongoDB

```bash
# Use MongoDB Atlas
# Create cluster and get connection string

# Set environment variable
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-chatbot
```

#### Step 3: Set Environment Variables

```bash
# Set all required variables
heroku config:set OPENAI_API_KEY=sk-your_key_here
heroku config:set JWT_SECRET=your_jwt_secret_here
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
heroku config:set GOOGLE_CALLBACK_URL=https://your-app-name.herokuapp.com/api/auth/google/callback
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
heroku config:set NODE_ENV=production
```

#### Step 4: Create Procfile

Create `Procfile` in root directory:

```
web: cd server && node server.js
```

#### Step 5: Build and Deploy

```bash
# Build frontend
cd client
npm run build

# Copy build to server
cp -r build ../server/public

# Deploy to Heroku
cd ..
git add .
git commit -m "Production build"
git push heroku main

# View logs
heroku logs --tail
```

#### Step 6: Open Application

```bash
heroku open
```

---

### Option 2: AWS EC2

#### Prerequisites

- AWS account
- EC2 instance (t2.micro or larger)
- Elastic IP assigned
- Security groups configured

#### Step 1: Launch EC2 Instance

1. Go to AWS Console
2. EC2 → Instances → Launch Instance
3. Choose Ubuntu 20.04 LTS
4. Select t2.micro (or larger)
5. Configure security groups:
   - Allow SSH (22)
   - Allow HTTP (80)
   - Allow HTTPS (443)
   - Allow custom TCP (5000)

#### Step 2: Connect to Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update
sudo apt upgrade -y
```

#### Step 3: Install Dependencies

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx

# Install SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 4: Clone and Setup

```bash
# Clone repository
git clone https://github.com/yourusername/my-health-chatbot.git
cd my-health-chatbot

# Install backend dependencies
cd server
npm install

# Create .env file
nano .env
# Add all required environment variables

# Install frontend dependencies
cd ../client
npm install

# Build frontend
npm run build

# Move build to server
cp -r build ../server/public
```

#### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/health-chatbot`:

```nginx
upstream app {
  server 127.0.0.1:5000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/health-chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL

```bash
sudo certbot --nginx -d your-domain.com
```

#### Step 7: Run Application with PM2

```bash
# Install PM2
sudo npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'health-chatbot',
    script: './server.js',
    cwd: './server',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Monitor
pm2 logs health-chatbot
```

---

### Option 3: DigitalOcean App Platform

#### Step 1: Push to GitHub

```bash
git push origin main
```

#### Step 2: Connect to DigitalOcean

1. Go to DigitalOcean App Platform
2. Create → Apps
3. Connect GitHub repository
4. Select branch

#### Step 3: Configure Services

Add service for backend:
- Name: `api`
- Source: repository
- Build: `cd server && npm install`
- Run: `npm start`

Add service for frontend:
- Name: `web`
- Source: repository
- Build: `cd client && npm run build`
- Run: `npm start`

#### Step 4: Set Environment Variables

Configure for each service:
- OPENAI_API_KEY
- JWT_SECRET
- MongoDB connection string
- OAuth credentials

#### Step 5: Deploy

Click "Deploy" button. DigitalOcean will build and deploy automatically.

---

### Option 4: Docker Deployment

#### Create Docker Files

**Dockerfile (Backend):**

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]
```

**Dockerfile (Frontend):**

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/health-chatbot
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongo

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy Docker

```bash
docker-compose build
docker-compose up -d
```

---

## 📊 Production Checklist

### Application

- [ ] All environment variables set
- [ ] Database indexed for performance
- [ ] API rate limiting enabled
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Backups scheduled

### Security

- [ ] SSL/TLS certificate installed
- [ ] Firewall rules configured
- [ ] API keys rotated
- [ ] Secrets stored securely
- [ ] Regular security updates
- [ ] DDoS protection enabled

### Performance

- [ ] CDN configured
- [ ] Caching enabled
- [ ] Database optimized
- [ ] Static assets minified
- [ ] Images optimized
- [ ] Load testing completed

### Monitoring

- [ ] Error tracking (Sentry)
- [ ] Application monitoring (New Relic)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Security monitoring
- [ ] Log aggregation

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build
        run: |
          cd client
          npm install
          npm run build
          cd ../server
          npm install
      
      - name: Test
        run: npm test
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git push https://heroku:${HEROKU_API_KEY}@git.heroku.com/your-app-name.git main
```

---

## 🗄️ Database Backup

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/health-chatbot" --out=./backup

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/health-chatbot" ./backup/health-chatbot
```

### Automated Backup

Set up MongoDB Atlas automated backups or use cron jobs:

```bash
# Backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out=./backups/backup_$DATE
find ./backups -type d -mtime +30 -exec rm -rf {} \;

# Schedule with cron
# 0 2 * * * /path/to/backup.sh
```

---

## 📈 Scaling

### Horizontal Scaling

For multiple servers:
1. Load balancer (Nginx, HAProxy)
2. Multiple app instances
3. Shared database
4. Session storage (Redis)
5. File storage (S3)

### Vertical Scaling

Upgrade instance:
- More CPU cores
- Increased RAM
- Faster storage

---

## 📊 Monitoring and Logging

### Error Tracking

```bash
# Install Sentry
npm install @sentry/node

# Initialize in app
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Application Performance

Use New Relic or DataDog:
- Response time monitoring
- Database query analysis
- Error rate tracking
- Usage analytics

### Log Aggregation

Services like LogRocket, Papertrail:
- Centralized logging
- Real-time alerts
- Search and filter
- Error analysis

---

## 🚨 Rollback Procedure

### In Case of Issues

```bash
# Identify issue
# Review error logs
# Prepare rollback

# Heroku rollback
heroku releases
heroku rollback v99

# Git rollback
git revert <commit-hash>
git push origin main

# Database rollback
mongorestore --uri="$MONGODB_URI" ./backup/health-chatbot
```

---

## 📝 Post-Deployment

### Verify

1. Check application loading
2. Test all features
3. Verify API endpoints
4. Check database connections
5. Monitor error logs
6. Test mobile responsiveness

### Monitor

1. Watch error rates
2. Monitor performance
3. Track user activity
4. Review analytics

### Update

1. Create CHANGELOG entry
2. Update documentation
3. Notify users
4. Archive old backups

---

## 📞 Support

### Common Issues

**Application won't start:**
- Check environment variables
- Verify database connection
- Review error logs
- Check API keys

**Slow performance:**
- Check database indexes
- Enable caching
- Use CDN
- Optimize queries

**High error rate:**
- Review recent changes
- Check API limits
- Verify external services
- Rollback if necessary

---

## 📚 Resources

- [Heroku Deployment Guide](https://devcenter.heroku.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated:** November 14, 2025
**Version:** 1.0.0
