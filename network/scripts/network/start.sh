#!/bin/bash

# Script to start the Hyperledger Fabric network

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Function to start the network
start_network() {
    print_status "Starting the network..."
    
    # Check if network is already running
    if docker ps | grep -q "fabric"; then
        print_warning "Network is already running. Stopping and removing existing containers..."
        docker-compose -f "$SCRIPT_DIR/../../docker-compose.yaml" down -v
    fi
    
    # Start the network
    if ! docker-compose -f "$SCRIPT_DIR/../../docker-compose.yaml" up -d; then
        print_error "Failed to start the network"
        exit 1
    fi
    
    print_success "Network started successfully!"
}

# Function to wait for network to be ready
wait_for_network() {
    local max_retries=10
    local retry_count=0
    local ready=false
    
    print_status "Waiting for network to be ready..."
    
    while [ $retry_count -lt $max_retries ] && [ "$ready" = false ]; do
        if docker ps | grep -q "fabric"; then
            ready=true
            for container in $(docker ps --format '{{.Names}}' | grep fabric); do
                status=$(docker inspect -f '{{.State.Status}}' "$container")
                if [ "$status" != "running" ]; then
                    ready=false
                    break
                fi
            done
        fi
        
        if [ "$ready" = false ]; then
            retry_count=$((retry_count + 1))
            sleep 5
        fi
    done
    
    if [ "$ready" = false ]; then
        print_error "Network is not ready after $max_retries attempts"
        exit 1
    fi
    
    print_success "Network is ready!"
}

# Main execution
if [[ "$1" == "--help" ]]; then
    echo "Usage: $0 [--wait]"
    echo "  --wait  Wait for network to be ready"
    exit 0
fi

start_network

if [[ "$1" == "--wait" ]]; then
    wait_for_network
fi
