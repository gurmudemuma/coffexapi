#!/bin/bash

# Script to generate cryptographic materials for organizations

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Function to generate crypto materials
generate_crypto() {
    print_status "Generating crypto materials for all organizations..."
    
    # Set paths
    CRYPTOGEN_CMD="$BIN_DIR/cryptogen"
    CRYPTO_CONFIG="$SCRIPT_DIR/../organizations/crypto-config.yaml"
    OUTPUT_DIR="$SCRIPT_DIR/../organizations"
    
    if [ ! -f "$CRYPTO_CONFIG" ]; then
        print_error "Crypto config file not found: $CRYPTO_CONFIG"
        exit 1
    fi
    
    # Clean up previous crypto materials
    if [ -d "$OUTPUT_DIR/peerOrganizations" ] || [ -d "$OUTPUT_DIR/ordererOrganizations" ]; then
        print_status "Removing previous crypto materials..."
        rm -rf "$OUTPUT_DIR/peerOrganizations"
        rm -rf "$OUTPUT_DIR/ordererOrganizations"
    fi
    
    # Generate crypto materials
    print_status "Generating new crypto materials..."
    if ! $CRYPTOGEN_CMD generate --config="$CRYPTO_CONFIG" --output="$OUTPUT_DIR"; then
        print_error "Failed to generate crypto materials"
        exit 1
    fi
    
    # Set proper permissions
    find "$OUTPUT_DIR" -type f -name "*.pem" -exec chmod 644 {} \;
    find "$OUTPUT_DIR" -type f -name "*_sk" -exec chmod 600 {} \;
    
    print_success "Successfully generated crypto materials in $OUTPUT_DIR"
}

# Main execution
if [[ "$1" == "--help" ]]; then
    echo "Usage: $0 [--force]"
    echo "  --force  Skip confirmation prompt"
    exit 0
fi

if [[ "$1" != "--force" ]]; then
    read -p "This will generate new cryptographic materials. Continue? [y/N] " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_status "Operation cancelled."
        exit 0
    fi
fi

generate_crypto
