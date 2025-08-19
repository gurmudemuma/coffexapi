#!/bin/bash

# Download only the required Hyperledger Fabric CLI tools
# This script downloads only cryptogen and configtxgen without the full samples

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

FABRIC_VERSION="2.5.0"
CA_VERSION="1.5.0"
ARCH=$(uname -m | sed 's/x86_64/amd64/')
OS=$(uname -s | tr '[:upper:]' '[:lower:]')

print_status "Downloading Hyperledger Fabric CLI tools..."
print_status "Version: $FABRIC_VERSION"
print_status "Architecture: $ARCH"
print_status "OS: $OS"

# Create bin directory
mkdir -p bin

# Download cryptogen
print_status "Downloading cryptogen..."
curl -L "https://github.com/hyperledger/fabric/releases/download/v${FABRIC_VERSION}/hyperledger-fabric-${OS}-${ARCH}-${FABRIC_VERSION}.tar.gz" | tar xz
cp bin/cryptogen bin/configtxgen . 2>/dev/null || true

# Clean up
rm -rf bin config

# Make executable
chmod +x cryptogen configtxgen 2>/dev/null || true

# Add to PATH for current session
export PATH=$PATH:$PWD

print_success "Fabric CLI tools downloaded successfully!"
print_status "Tools available:"
echo "  - cryptogen: $(which cryptogen 2>/dev/null || echo 'Not found')"
echo "  - configtxgen: $(which configtxgen 2>/dev/null || echo 'Not found')"

print_status "To use these tools permanently, add to your PATH:"
echo "export PATH=\$PATH:$PWD"
