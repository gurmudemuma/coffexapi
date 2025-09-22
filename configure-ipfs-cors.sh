#!/bin/bash

echo "Removing IPFS CORS settings to prevent conflicts with API Gateway..."

# Check if IPFS container is running
if ! docker ps | grep -q "ipfs"; then
    echo "Starting IPFS container..."
    docker-compose up -d ipfs
    sleep 10
fi

# Remove CORS settings from IPFS API (API Gateway will handle CORS)
echo "Removing CORS configuration from IPFS..."
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin 'null'
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods 'null'
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers 'null'

# Restart IPFS to apply changes
echo "Restarting IPFS to apply configuration changes..."
docker-compose restart ipfs

# Wait for IPFS to be ready
echo "Waiting for IPFS to be ready..."
sleep 15

# Test IPFS API
echo "Testing IPFS API..."
if curl -s http://localhost:5001/api/v0/version > /dev/null 2>&1; then
    echo "✅ IPFS API is accessible at http://localhost:5001"
    echo "✅ CORS headers removed - API Gateway will handle CORS"
else
    echo "❌ IPFS API is not accessible"
fi

echo "IPFS CORS configuration complete!"