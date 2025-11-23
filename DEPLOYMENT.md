# Deployment Guide for AWS EC2

## Server Details
- **IP Address:** 3.82.22.192
- **Key Pair:** PNews
- **Application:** PoliticalNews

## Prerequisites on Local Machine
- SSH access to the server
- Key pair file `PNews.pem`

## Initial Server Setup

### 1. Connect to your EC2 instance
```bash
ssh -i /path/to/PNews.pem ec2-user@3.82.22.192
# or for Ubuntu
ssh -i /path/to/PNews.pem ubuntu@3.82.22.192
```

### 2. Update the system
```bash
sudo yum update -y  # For Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # For Ubuntu
```

### 3. Install Node.js (v18+)
```bash
# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node --version
```

### 4. Install Git
```bash
sudo yum install git -y  # Amazon Linux
# or
sudo apt install git -y  # Ubuntu
```

### 5. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

## Deploy Application

### 1. Clone the repository
```bash
cd ~
git clone https://github.com/bholsinger09/PolitcalNews.git
cd PolitcalNews
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
nano .env
```

Add your configuration:
```env
# API Keys
NEWS_API_KEY=your_news_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (use your EC2 IP)
FRONTEND_URL=http://3.82.22.192:3000
```

### 4. Build the application
```bash
npm run build
```

### 5. Configure Firewall (Security Groups)
In AWS Console, ensure your Security Group allows:
- Port 22 (SSH)
- Port 3000 (Frontend)
- Port 3001 (Backend API)
- Port 80 (HTTP) - optional
- Port 443 (HTTPS) - optional

## Start the Application

### Option 1: Using PM2 (Recommended)

Create PM2 ecosystem file:
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'political-news-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'political-news-frontend',
      cwd: './frontend',
      script: 'npx',
      args: 'vite preview --port 3000 --host',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    }
  ]
};
EOF
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npx vite preview --port 3000 --host
```

## Access Your Application

- **Frontend:** http://3.82.22.192:3000
- **Backend API:** http://3.82.22.192:3001/health

## Useful PM2 Commands

```bash
# View logs
pm2 logs

# Check status
pm2 status

# Restart apps
pm2 restart all

# Stop apps
pm2 stop all

# Monitor
pm2 monit
```

## Update Deployment

```bash
cd ~/PolitcalNews
git pull origin main
npm install
npm run build
pm2 restart all
```

## Setup Nginx (Optional - Recommended for Production)

### 1. Install Nginx
```bash
sudo yum install nginx -y  # Amazon Linux
# or
sudo apt install nginx -y  # Ubuntu
```

### 2. Configure Nginx
```bash
sudo nano /etc/nginx/conf.d/politicalnews.conf
```

Add configuration:
```nginx
server {
    listen 80;
    server_name 3.82.22.192;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

Now access via: http://3.82.22.192

## Setup SSL (Optional)

If you have a domain name, use Let's Encrypt:

```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Monitoring & Maintenance

### Check Application Health
```bash
# Backend health
curl http://localhost:3001/health

# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 100
```

### Monitor Resources
```bash
# CPU and Memory
htop
# or
top

# Disk usage
df -h

# PM2 monitoring
pm2 monit
```

## Troubleshooting

### Port already in use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>
```

### Permission issues
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/PolitcalNews
```

### View application logs
```bash
# PM2 logs
pm2 logs political-news-backend --lines 100
pm2 logs political-news-frontend --lines 100

# System logs
sudo journalctl -u nginx -n 50
```

## Security Best Practices

1. **Never commit .env file** (already in .gitignore)
2. **Use environment variables** for sensitive data
3. **Keep system updated**: `sudo yum update -y`
4. **Configure firewall** properly in AWS Security Groups
5. **Use SSL/HTTPS** in production
6. **Regular backups** of your data
7. **Monitor logs** for suspicious activity

## Backup & Restore

### Backup
```bash
# Create backup
tar -czf ~/politicalnews-backup-$(date +%Y%m%d).tar.gz ~/PolitcalNews

# Download to local machine
scp -i /path/to/PNews.pem ec2-user@3.82.22.192:~/politicalnews-backup-*.tar.gz ./
```

### Restore
```bash
# Upload backup
scp -i /path/to/PNews.pem ./politicalnews-backup-*.tar.gz ec2-user@3.82.22.192:~/

# Extract
tar -xzf ~/politicalnews-backup-*.tar.gz -C ~/
```

## Quick Deploy Script

Save as `deploy.sh`:
```bash
#!/bin/bash
cd ~/PolitcalNews
git pull origin main
npm install
npm run build
pm2 restart all
echo "Deployment complete!"
```

Make executable and use:
```bash
chmod +x deploy.sh
./deploy.sh
```
