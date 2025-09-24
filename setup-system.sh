#!/bin/bash

# Coffee Export System - Complete Setup Script
# This script sets up the entire Coffee Export Consortium system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "========================================================"
    echo "  Coffee Export Consortium System - Complete Setup"
    echo "========================================================"
    echo -e "${NC}"
}

# Clean the environment before setup
print_status "Running full cleanup script..."
if [ -f "./clean-all.sh" ]; then
    ./clean-all.sh
    print_success "Cleanup complete."
else
    print_warning "'clean-all.sh' not found. Skipping full cleanup."
fi

# Load environment variables
load_environment() {
    print_status "Loading environment variables..."
    
    if [ -f ".env.system" ]; then
        source .env.system
        print_success "Environment variables loaded from .env.system"
    else
        print_warning ".env.system not found, using defaults"
        export CHANNEL_NAME=coffeeexport
        export CHAINCODE_NAME=coffee_export
        export API_GATEWAY_PORT=8000
        export FRONTEND_PORT=3001
    fi
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking system prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check Node.js (for frontend)
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Frontend setup will be skipped."
        SKIP_FRONTEND=true
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi

    print_success "Prerequisites check completed"
}

# Clean up previous installations
cleanup_previous() {
    print_status "Cleaning up previous installations..."
    
    # Stop all containers
    docker-compose down -v 2>/dev/null || true
    
    # Remove orphaned containers
    docker container prune -f 2>/dev/null || true
    
    # Remove unused networks
    docker network prune -f 2>/dev/null || true
    
    # Clean up network artifacts
    rm -rf network/organizations/peerOrganizations 2>/dev/null || true
    rm -rf network/organizations/ordererOrganizations 2>/dev/null || true
    rm -rf network/system-genesis-block 2>/dev/null || true
    rm -rf network/channel-artifacts 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Setup network directories
setup_directories() {
    print_status "Setting up network directories..."
    
    # Create necessary directories
    mkdir -p network/organizations/peerOrganizations
    mkdir -p network/organizations/ordererOrganizations
    mkdir -p network/system-genesis-block
    mkdir -p network/channel-artifacts
    mkdir -p network/organizations/cryptogen
    
    print_success "Directories created"
}

# Create crypto configuration files
create_crypto_configs() {
    print_status "Creating crypto configuration files..."
    
    # Create orderer crypto config
    cat > network/organizations/cryptogen/crypto-config-orderer.yaml << EOF
OrdererOrgs:
  - Name: Orderer
    Domain: coffee-consortium.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer
        SANS:
          - localhost
          - 127.0.0.1
          - orderer.coffee-consortium.com
EOF

    # Create peer organizations crypto config
    cat > network/organizations/cryptogen/crypto-config.yaml << EOF
PeerOrgs:
  - Name: NationalBank
    Domain: nationalbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
    Users:
      Count: 1

  - Name: ExporterBank
    Domain: exporterbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
    Users:
      Count: 1

  - Name: CoffeeAuthority
    Domain: coffeeauthority.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
    Users:
      Count: 1

  - Name: Customs
    Domain: customs.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
    Users:
      Count: 1
EOF

    print_success "Crypto configuration files created"
}

# Download Fabric binaries if needed
download_fabric_binaries() {
    print_status "Checking Fabric binaries..."
    
    if [ -f "./bin/cryptogen" ] && [ -f "./bin/configtxgen" ]; then
        print_success "Fabric binaries found"
        export PATH=$PWD/bin:$PATH
        return 0
    fi
    
    if command -v cryptogen &> /dev/null && command -v configtxgen &> /dev/null; then
        print_success "Fabric binaries available in system PATH"
        return 0
    fi
    
    print_status "Downloading Fabric binaries..."
    
    # Create bin directory
    mkdir -p bin
    
    # Download specific binaries we need
    FABRIC_VERSION=2.5.4
    ARCH=$(uname -m)
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    
    if [ "$OS" = "darwin" ]; then
        OS="darwin"
    elif [ "$OS" = "linux" ]; then
        OS="linux"
    else
        print_error "Unsupported operating system: $OS"
        exit 1
    fi
    
    if [ "$ARCH" = "x86_64" ]; then
        ARCH="amd64"
    elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        ARCH="arm64"
    else
        print_error "Unsupported architecture: $ARCH"
        exit 1
    fi
    
    BINARY_URL="https://github.com/hyperledger/fabric/releases/download/v${FABRIC_VERSION}/hyperledger-fabric-${OS}-${ARCH}-${FABRIC_VERSION}.tar.gz"
    
    print_status "Downloading from: $BINARY_URL"
    
    if command -v curl &> /dev/null; then
        curl -L "$BINARY_URL" | tar xz -C . bin/cryptogen bin/configtxgen
    elif command -v wget &> /dev/null; then
        wget -qO- "$BINARY_URL" | tar xz -C . bin/cryptogen bin/configtxgen
    else
        print_error "Neither curl nor wget is available. Please install one of them."
        exit 1
    fi
    
    chmod +x bin/cryptogen bin/configtxgen
    export PATH=$PWD/bin:$PATH
    
    print_success "Fabric binaries downloaded and configured"
}

# Generate crypto materials
generate_crypto_materials() {
    print_status "Generating crypto materials..."
    
    cd network
    
    # Generate orderer crypto materials
    ../bin/cryptogen generate --config=organizations/cryptogen/crypto-config-orderer.yaml --output=organizations
    
    # Generate peer crypto materials
    ../bin/cryptogen generate --config=organizations/cryptogen/crypto-config.yaml --output=organizations
    
    cd ..
    
    print_success "Crypto materials generated"
}

# Generate network artifacts
generate_network_artifacts() {
    print_status "Generating network artifacts..."
    
    # Ensure old artifacts are removed before generating new ones
    rm -rf network/channel-artifacts/* 2>/dev/null || true
    rm -rf network/system-genesis-block/* 2>/dev/null || true

    export FABRIC_CFG_PATH=$PWD/network
    
    # Generate genesis block
    ./bin/configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock network/system-genesis-block/genesis.block
    
    # Generate channel transaction
    ./bin/configtxgen -profile CoffeeExportChannel -outputCreateChannelTx network/channel-artifacts/channel.tx -channelID coffeeexport
    
    # Generate anchor peer transactions
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/NationalBankMSPanchors.tx -channelID coffeeexport -asOrg NationalBankMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/ExporterBankMSPanchors.tx -channelID coffeeexport -asOrg ExporterBankMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/CoffeeAuthorityMSPanchors.tx -channelID coffeeexport -asOrg CoffeeAuthorityMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/CustomsMSPanchors.tx -channelID coffeeexport -asOrg CustomsMSP
    
    print_success "Network artifacts generated"
}

# Start the network
start_network() {
    print_status "Starting the consortium network..."
    
    # Start the network
    docker-compose up -d orderer.coffee-consortium.com
    sleep 5
    
    docker-compose up -d couchdb.nationalbank.com couchdb.exporterbank.com couchdb.coffeeauthority.com couchdb.customs.com
    sleep 10
    
    docker-compose up -d peer0.nationalbank.com peer0.exporterbank.com peer0.coffeeauthority.com peer0.customs.com
    sleep 10
    
    docker-compose up -d cli
    sleep 5
    
    print_success "Network containers started"
}

# Create and join channel
setup_channel() {
    print_status "Setting up channel..."
    
    # Execute channel creation script inside the CLI container.
    # The container's default environment is pre-configured with the correct admin identity.
    docker exec cli /etc/hyperledger/fabric/scripts/create-channel.sh
    
    print_success "Channel setup completed"
}

# Start additional services
start_services() {
    print_status "Starting additional services..."
    
    # Start IPFS
    docker-compose up -d ipfs
    sleep 5
    
    # Start validators
    docker-compose up -d national-bank-validator bank-api-validator quality-authority-validator customs-validator
    sleep 10
    
    # Start API Gateway
    docker-compose up -d api-gateway
    sleep 5
    
    print_success "Additional services started"
}

# Setup frontend
setup_frontend() {
    if [ "$SKIP_FRONTEND" = true ]; then
        print_warning "Skipping frontend setup (Node.js not available)"
        return 0
    fi
    
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Ensure .env file exists
    if [ ! -f ".env" ]; then
        print_warning "Frontend .env file not found, but it should have been created earlier"
    fi
    
    cd ..
    
    print_success "Frontend setup completed"
}

# Display system status
show_system_status() {
    print_success "🎉 Coffee Export Consortium System Setup Complete!"
    echo ""
    echo "📊 System Status:"
    echo "=================="
    echo ""
    echo "🔗 Blockchain Network:"
    echo "  - Orderer: localhost:7050"
    echo "  - National Bank Peer: localhost:7051"
    echo "  - Exporter Bank Peer: localhost:8051"
    echo "  - Coffee Authority Peer: localhost:9051"
    echo "  - Customs Peer: localhost:10051"
    echo ""
    echo "🗄️  CouchDB Instances:"
    echo "  - National Bank: localhost:15984"
    echo "  - Exporter Bank: localhost:15985"
    echo "  - Coffee Authority: localhost:15986"
    echo "  - Customs: localhost:15987"
    echo ""
    echo "🔍 Validator Services:"
    echo "  - National Bank: localhost:8083"
    echo "  - Bank API: localhost:5000"
    echo "  - Quality Authority: localhost:8081"
    echo "  - Customs: localhost:8082"
    echo ""
    echo "🌐 API & Services:"
    echo "  - API Gateway: localhost:8000"
    echo "  - IPFS: localhost:5001 (API), localhost:8090 (Gateway)"
    echo ""
    if [ "$SKIP_FRONTEND" != true ]; then
        echo "🎨 Frontend:"
        echo "  - Development: cd frontend && npm run dev"
        echo "  - Production: cd frontend && npm run build && npm run preview"
        echo ""
    fi
    echo "📋 Next Steps:"
    echo "=============="
    echo "1. Deploy chaincode: ./network/scripts/deploy-chaincode.sh"
    echo "2. Start frontend: cd frontend && npm run dev"
    echo "3. Access the application at http://localhost:3001"
    echo ""
    echo "🔧 Management Commands:"
    echo "======================"
    echo "- View logs: docker-compose logs -f [service-name]"
    echo "- Stop system: docker-compose down"
    echo "- Restart system: docker-compose restart"
    echo "- Clean restart: ./setup-system.sh"
}

# Main execution
main() {
    print_header
    
    load_environment
    check_prerequisites
    cleanup_previous
    setup_directories
    create_crypto_configs
    download_fabric_binaries
    generate_crypto_materials
    generate_network_artifacts
    start_network
    setup_channel
    start_services
    setup_frontend
    show_system_status
}

# Handle script interruption
trap 'print_error "Setup interrupted"; exit 1' INT TERM

# Run main function
main "$@"