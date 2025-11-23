#!/bin/bash

echo "🔒 Setting up HTTPS for PoliticalNews..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Install Nginx if not installed
echo -e "${BLUE}📦 Installing Nginx...${NC}"
apt update
apt install -y nginx

# Install Certbot
echo -e "${BLUE}📦 Installing Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# Create Nginx configuration
echo -e "${BLUE}⚙️  Creating Nginx configuration...${NC}"
cat > /etc/nginx/sites-available/politicalnews << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name politcalnews.duckdns.org;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name politcalnews.duckdns.org;

    # SSL certificates (will be added by certbot)
    ssl_certificate /etc/letsencrypt/live/politcalnews.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/politcalnews.duckdns.org/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend - proxy to Vite preview
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API - proxy to backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket - proxy to backend
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/politicalnews /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "${BLUE}🧪 Testing Nginx configuration...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo "❌ Nginx configuration is invalid. Please check the errors above."
    exit 1
fi

# Restart Nginx
echo -e "${BLUE}🔄 Restarting Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx

echo ""
echo -e "${GREEN}✅ Nginx configured successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Obtain SSL certificate with:"
echo "   sudo certbot --nginx -d politcalnews.duckdns.org"
echo ""
echo "2. The certificate will auto-renew. Test renewal with:"
echo "   sudo certbot renew --dry-run"
echo ""
echo "3. Access your site at:"
echo "   https://politcalnews.duckdns.org"
echo ""
