# 🚀 AWS Deployment Quick Reference

## Server Info
- **IP:** 3.82.22.192
- **Key:** PNews.pem
- **User:** ec2-user (Amazon Linux) or ubuntu (Ubuntu)

## Connect to Server
```bash
ssh -i /path/to/PNews.pem ec2-user@3.82.22.192
```

## First Time Setup (One Command!)
```bash
# Clone and setup
git clone https://github.com/bholsinger09/PolitcalNews.git
cd PolitcalNews
./setup.sh

# Configure environment
nano .env
# Add your NEWS_API_KEY from newsapi.org

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Deploy Updates
```bash
cd ~/PolitcalNews
./deploy.sh
```

## Quick Commands

### PM2 Management
```bash
pm2 status              # Check status
pm2 logs                # View logs
pm2 logs backend        # Backend logs only
pm2 logs frontend       # Frontend logs only
pm2 restart all         # Restart both
pm2 stop all            # Stop both
pm2 delete all          # Remove from PM2
pm2 monit              # Live monitoring
```

### Manual Operations
```bash
# Backend only
cd ~/PolitcalNews/backend
npm start

# Frontend only
cd ~/PolitcalNews/frontend
npx vite preview --port 3000 --host
```

### Health Checks
```bash
# Test backend API
curl http://localhost:3001/health
curl http://localhost:3001/api/news

# Test from outside
curl http://3.82.22.192:3001/health
```

### View Logs
```bash
# PM2 logs
pm2 logs --lines 100

# Application logs
tail -f logs/backend-out.log
tail -f logs/backend-error.log
tail -f logs/frontend-out.log
```

### Troubleshooting
```bash
# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process on port
sudo kill -9 $(sudo lsof -t -i:3000)

# Restart everything
pm2 restart all

# Full reset
pm2 delete all
cd ~/PolitcalNews
git pull
npm install
npm run build
pm2 start ecosystem.config.js
```

## AWS Security Groups
Ensure these ports are open:
- **22** - SSH
- **3000** - Frontend
- **3001** - Backend
- **80** - HTTP (if using Nginx)
- **443** - HTTPS (if using SSL)

## Access Application
- **Frontend:** http://3.82.22.192:3000
- **Backend Health:** http://3.82.22.192:3001/health
- **Backend API:** http://3.82.22.192:3001/api/news

## Optional: Nginx Setup
```bash
# Install Nginx
sudo yum install nginx -y

# Copy config
sudo cp ~/PolitcalNews/nginx.conf /etc/nginx/conf.d/politicalnews.conf

# Test and start
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

# Now access via http://3.82.22.192
```

## Monitoring
```bash
# CPU & Memory
htop

# Disk usage
df -h

# PM2 monitoring
pm2 monit

# System logs
sudo journalctl -f
```

## Update Code
```bash
cd ~/PolitcalNews
git pull origin main
npm install
npm run build
pm2 restart all
```

## Backup
```bash
# Create backup
tar -czf ~/backup-$(date +%Y%m%d).tar.gz ~/PolitcalNews

# Download to local
scp -i /path/to/PNews.pem ec2-user@3.82.22.192:~/backup-*.tar.gz ./
```

## Environment Variables (.env)
```env
NEWS_API_KEY=your_key_here
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://3.82.22.192:3000
```

## Need Help?
1. Check logs: `pm2 logs`
2. Check status: `pm2 status`
3. Restart: `pm2 restart all`
4. Full documentation: `cat DEPLOYMENT.md`
