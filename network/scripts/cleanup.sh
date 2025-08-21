#!/bin/bash

# Cleanup script for network resources

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Function to clean up network resources
cleanup() {
    print_status "Cleaning up previous network artifacts..."
    
    # Remove containers and volumes
    if docker ps -a | grep -q "fabric"; then
        print_status "Removing all Fabric containers..."
        docker-compose -f "$SCRIPT_DIR/../../docker-compose.yaml" down -v
    else
        print_warning "No Fabric containers found to remove."
    fi
    
    # Remove chaincode containers and images
    print_status "Removing chaincode containers and images..."
    docker rm -f $(docker ps -a | grep "dev-peer" | awk '{print $1}') 2>/dev/null || true
    docker rmi -f $(docker images | grep "dev-peer" | awk '{print $3}') 2>/dev/null || true
    
    # Clean up chaincode build artifacts
    print_status "Cleaning chaincode build artifacts..."
    rm -rf "$SCRIPT_DIR/../../chaincode/go/vendor"
    rm -f "$SCRIPT_DIR/../../chaincode/go/go.sum"
    
    print_success "Cleanup completed successfully!"
}

# Main execution
if [[ "$1" == "--force" ]]; then
    cleanup
else
    read -p "This will stop and remove all containers and clean up network artifacts. Continue? [y/N] " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        cleanup
    else
        print_status "Cleanup cancelled."
    fi
fi
