# HTTPS Deployment Guide for PoliticalNews

## Prerequisites
- AWS EC2 instance running Ubuntu
- Domain configured (politcalnews.duckdns.org)
- SSH access to server

## Step-by-Step HTTPS Setup

### 1. Upload and Run HTTPS Setup Script

On your local machine:
```bash
scp -i ~/Downloads/PNews.pem setup-https.sh ubuntu@3.82.22.192:~/PolitcalNews/
```

On the AWS server:
```bash
cd ~/PolitcalNews
chmod +x setup-https.sh
sudo ./setup-https.sh
```

This script will:
- ✅ Install Nginx
- ✅ Install Certbot (Let's Encrypt)
- ✅ Configure Nginx as reverse proxy
- ✅ Set up HTTP to HTTPS redirect
- ✅ Configure WebSocket proxying

### 2. Obtain SSL Certificate

Run Certbot to get a free SSL certificate from Let's Encrypt:
```bash
sudo certbot --nginx -d politcalnews.duckdns.org
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose whether to share email with EFF (optional)

Certbot will:
- ✅ Verify domain ownership
- ✅ Generate SSL certificate
- ✅ Automatically configure Nginx
- ✅ Set up auto-renewal

### 3. Deploy Latest Code

```bash
cd ~/PolitcalNews
git pull origin main
./deploy.sh
```

### 4. Verify HTTPS is Working

Test your site:
- **Frontend**: https://politcalnews.duckdns.org
- **Backend API**: https://politcalnews.duckdns.org/api/health
- **WebSocket**: Should auto-connect via wss://

### 5. Check Services

```bash
# Check Nginx status
sudo systemctl status nginx

# Check PM2 processes
pm2 status

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Architecture Overview

```
Internet (HTTPS/443)
        ↓
    Nginx Reverse Proxy
        ↓
    ┌───────────────────────┐
    │   Route: /            │ → http://localhost:3000 (Frontend)
    │   Route: /api/*       │ → http://localhost:3001/api/* (Backend API)
    │   Route: /socket.io/* │ → http://localhost:3001/socket.io/* (WebSocket)
    └───────────────────────┘
```

## SSL Certificate Auto-Renewal

Certbot automatically sets up a cron job to renew certificates. Test it:
```bash
sudo certbot renew --dry-run
```

Certificates auto-renew when they're within 30 days of expiration.

## Firewall Configuration

Ensure ports are open:
```bash
# Allow HTTPS
sudo ufw allow 443/tcp

# Allow HTTP (for redirect)
sudo ufw allow 80/tcp

# Block direct access to backend ports (optional but recommended)
sudo ufw deny 3000/tcp
sudo ufw deny 3001/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

## Troubleshooting

### Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### WebSocket Connection Issues
Check browser console. WebSocket should connect to `wss://politcalnews.duckdns.org/socket.io/`

### Backend API Issues
```bash
# Check backend logs
pm2 logs political-news-backend

# Check if backend is running
curl http://localhost:3001/api/health
```

## Security Headers (Optional Enhancement)

Add these to Nginx config for better security:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Monitoring

Set up monitoring for certificate expiration:
```bash
# Check certificate expiry
sudo certbot certificates

# Set up email alerts for renewal failures (already configured by certbot)
```

## Success Checklist

- ✅ Nginx installed and running
- ✅ SSL certificate obtained and installed
- ✅ HTTPS site accessible at https://politcalnews.duckdns.org
- ✅ HTTP automatically redirects to HTTPS
- ✅ WebSocket connects via wss://
- ✅ API endpoints work via HTTPS
- ✅ Analytics dashboard loads charts
- ✅ Live update notifications appear
- ✅ Mobile responsive design works
- ✅ Certificate auto-renewal configured

## Benefits of HTTPS

🔒 **Security**: Encrypted connection between users and server
🔐 **Authentication**: Verifies your site is legitimate
🚀 **SEO**: Better search engine rankings
📱 **PWA Support**: Required for Progressive Web Apps
🌐 **Modern APIs**: Required for geolocation, camera, etc.
✅ **Trust**: Green padlock in browser increases user confidence

## Next Steps

Your site is now production-ready with HTTPS! Consider:
- Setting up monitoring (e.g., UptimeRobot, Pingdom)
- Configuring CDN (e.g., Cloudflare) for better performance
- Setting up automated backups
- Implementing rate limiting
- Adding analytics (Google Analytics, Plausible)
