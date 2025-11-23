#!/bin/bash

# Quick deployment script for PoliticalNews
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2 processes
echo "♻️  Restarting application..."
pm2 restart ecosystem.config.js

# Show status
echo "✅ Deployment complete!"
echo ""
pm2 status

echo ""
echo "📊 View logs with: pm2 logs"
echo "🔍 Check status with: pm2 status"
