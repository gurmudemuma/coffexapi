#!/bin/bash

# This script cleans the entire environment for the Coffee Export Blockchain System.
# It stops and removes all Docker containers, networks, and volumes,
# and deletes all generated artifacts.

echo "Starting a full cleanup..."

# Stop and remove all containers defined in docker-compose.yaml
if [ -f "docker-compose.yaml" ]; then
    echo "Stopping and removing Docker containers..."
    docker-compose down -v --remove-orphans
fi

# Prune Docker system to remove any stopped containers, networks, and dangling images
echo "Pruning Docker system..."
docker system prune -af

# Remove chaincode images
echo "Removing chaincode images..."
docker rmi $(docker images dev-* -q) 2>/dev/null || true

# Remove network artifacts
echo "Removing network artifacts..."
rm -rf network/organizations/peerOrganizations
rm -rf network/organizations/ordererOrganizations
rm -rf network/channel-artifacts/*

# Remove temporary files
echo "Removing temporary files..."
rm -f decoded_tx.json
rm -f master.zip
rm -f start-system.sh.bak
rm -f *.json
rm -f *.log
rm -f test-file.txt

echo "Full cleanup complete!"
