#!/bin/bash

# Cleanup script for the Coffee Export Blockchain System
# This script removes temporary and redundant files

echo "Starting cleanup..."

# Remove temporary files
rm -f decoded_tx.json
rm -f master.zip
rm -f start-system.sh.bak

# Remove reconstructed config files if they're not needed
if [ -f "configtx.yaml" ] && [ -f "configtx.reconstructed.yaml" ]; then
    echo "Found both configtx.yaml and configtx.reconstructed.yaml"
    echo "Please review and keep only the correct version"
    # Uncomment the following lines after review
    # rm -f configtx.reconstructed.yaml
fi

if [ -f "docker-compose.yaml" ] && [ -f "docker-compose.reconstructed.yaml" ]; then
    echo "Found both docker-compose.yaml and docker-compose.reconstructed.yaml"
    echo "Please review and keep only the correct version"
    # Uncomment the following lines after review
    # rm -f docker-compose.reconstructed.yaml
fi

echo "Cleanup complete!"
