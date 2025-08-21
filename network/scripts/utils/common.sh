#!/bin/bash

# Common variables and functions for network scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Set absolute path to the bin directory
BIN_DIR="${BIN_DIR:-/home/gu-da/coffexapi/bin}"
export PATH=$BIN_DIR:$PATH

# Verify binaries exist
verify_binaries() {
    if [ ! -f "$BIN_DIR/cryptogen" ] || [ ! -f "$BIN_DIR/configtxgen" ]; then
        print_error "Hyperledger Fabric binaries not found in $BIN_DIR"
        exit 1
    fi
    print_status "Using Hyperledger Fabric binaries from: $BIN_DIR"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. Some features might not work as expected."
    fi
    
    print_success "All prerequisites are installed."
}

# Source this file in other scripts with:
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# source "$SCRIPT_DIR/utils/common.sh"
