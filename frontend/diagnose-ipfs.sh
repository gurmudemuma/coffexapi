#!/bin/bash

# IPFS Diagnostic Script
# This script checks IPFS connectivity and configuration

echo "🔍 IPFS Diagnostic Tool"
echo "======================="

# Check if IPFS service is accessible
echo "Checking IPFS API endpoint..."
if curl -s http://localhost:5001/api/v0/version > /dev/null 2>&1; then
    echo "✅ IPFS API is accessible at http://localhost:5001"
    
    # Get IPFS version
    version=$(curl -s http://localhost:5001/api/v0/version | grep -o '"Version":"[^"]*"' | cut -d'"' -f4)
    echo "📦 IPFS Version: $version"
else
    echo "❌ IPFS API is not accessible at http://localhost:5001"
    echo "Possible solutions:"
    echo "  1. Start IPFS service: docker-compose up ipfs -d"
    echo "  2. Check if Docker is running"
    echo "  3. Check if port 5001 is not blocked"
fi

echo ""

# Check if IPFS gateway is accessible
echo "Checking IPFS Gateway..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ IPFS Gateway is accessible at http://localhost:8080"
else
    echo "❌ IPFS Gateway is not accessible at http://localhost:8080"
fi

echo ""

# Check Docker container status
echo "Checking Docker containers..."
if command -v docker > /dev/null 2>&1; then
    if docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -q "ipfs"; then
        status=$(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep "ipfs")
        echo "✅ IPFS Docker container status: $status"
    else
        echo "❌ IPFS Docker container is not running"
        echo "To start: docker-compose up ipfs -d"
    fi
else
    echo "⚠️  Docker command not found"
fi

echo ""

# Check environment variables
echo "Checking Frontend Environment..."
if [ -f ".env" ]; then
    if grep -q "VITE_FEATURE_IPFS_UPLOAD=true" .env; then
        echo "✅ IPFS uploads are enabled in .env"
    else
        echo "❌ IPFS uploads are disabled in .env"
        echo "Set VITE_FEATURE_IPFS_UPLOAD=true to enable"
    fi
else
    echo "❌ .env file not found"
    echo "Run: npm run setup to create it"
fi

echo ""
echo "🏁 Diagnostic complete!"