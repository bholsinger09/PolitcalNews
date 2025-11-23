#!/bin/bash

# Quick Start Script for AWS EC2 Deployment
# Run this script on your AWS instance after cloning the repository

echo "🚀 PoliticalNews - AWS EC2 Setup Script"
echo "=========================================="
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root" 
   exit 1
fi

# Update system
echo "📦 Updating system packages..."
if command -v yum &> /dev/null; then
    sudo yum update -y
elif command -v apt &> /dev/null; then
    sudo apt update && sudo apt upgrade -y
fi

# Install Node.js via nvm if not installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# Create logs directory
mkdir -p logs

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your NewsAPI key!"
    echo "   Run: nano .env"
    echo "   Get API key from: https://newsapi.org/"
    echo ""
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Add your NEWS_API_KEY"
echo "3. Start the application: pm2 start ecosystem.config.js"
echo "4. Save PM2 config: pm2 save && pm2 startup"
echo ""
echo "Access your application at:"
echo "- Frontend: http://3.82.22.192:3000"
echo "- Backend: http://3.82.22.192:3001/health"
echo ""
echo "Useful commands:"
echo "- View logs: pm2 logs"
echo "- Check status: pm2 status"
echo "- Restart: pm2 restart all"
echo "- Deploy updates: ./deploy.sh"
echo ""
