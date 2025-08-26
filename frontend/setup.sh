#!/bin/bash

# Coffexapi Frontend Setup Script
# This script sets up the environment and ensures all services are ready

set -e

echo "🚀 Setting up Coffexapi Frontend..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file with default settings"
else
    echo "✅ .env file already exists"
fi

# Check if IPFS feature is enabled
if grep -q "VITE_FEATURE_IPFS_UPLOAD=true" .env; then
    echo "✅ IPFS uploads are enabled"
else
    echo "⚠️  IPFS uploads are disabled. Enable them by setting VITE_FEATURE_IPFS_UPLOAD=true in .env"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🔍 Checking IPFS service..."

# Check if IPFS container is running
if docker ps --format 'table {{.Names}}' | grep -q "ipfs"; then
    echo "✅ IPFS service is running"
else
    echo "⚠️  IPFS service is not running"
    echo "To start IPFS service, run from the project root:"
    echo "  docker-compose up ipfs -d"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Ensure IPFS is running: docker-compose up ipfs -d (from project root)"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "If you encounter IPFS upload errors:"
echo "- Check that VITE_FEATURE_IPFS_UPLOAD=true in .env"
echo "- Ensure IPFS service is running on port 5001"
echo "- Verify the API endpoint is accessible at http://localhost:5001"