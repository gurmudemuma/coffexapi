#!/bin/bash

# Coffee Export Platform - Network Setup with Exporter Organization
# This script sets up the complete blockchain network including the new Exporter organization

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
    echo "=================================================================="
    echo "  Coffee Export Platform - Network Setup with Exporter Org"
    echo "=================================================================="
    echo -e "${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
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
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Clean up existing network
cleanup_network() {
    print_status "Cleaning up existing network..."
    
    # Stop and remove containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Remove any dangling containers
    docker container prune -f 2>/dev/null || true
    
    # Clean up crypto materials
    if [ -d "./network/organizations/peerOrganizations" ]; then
        rm -rf ./network/organizations/peerOrganizations
    fi
    
    if [ -d "./network/organizations/ordererOrganizations" ]; then
        rm -rf ./network/organizations/ordererOrganizations
    fi
    
    # Clean up channel artifacts
    if [ -d "./network/channel-artifacts" ]; then
        rm -rf ./network/channel-artifacts/*.tx
        rm -rf ./network/channel-artifacts/*.block
    fi
    
    # Clean up genesis block
    if [ -d "./network/system-genesis-block" ]; then
        rm -rf ./network/system-genesis-block/genesis.block
    fi
    
    print_success "Network cleanup completed"
}

# Generate crypto materials
generate_crypto() {
    print_status "Generating crypto materials for all organizations..."
    
    # Ensure directories exist
    mkdir -p network/organizations
    mkdir -p network/channel-artifacts
    mkdir -p network/system-genesis-block
    
    # Generate crypto materials using cryptogen
    print_status "Running cryptogen..."
    
    # Use the cryptogen tool
    if command -v cryptogen &> /dev/null; then
        cryptogen generate --config=./network/organizations/cryptogen/crypto-config.yaml --output=./network/organizations
    elif [ -f "./bin/cryptogen" ]; then
        ./bin/cryptogen generate --config=./network/organizations/cryptogen/crypto-config.yaml --output=./network/organizations
    else
        print_error "cryptogen tool not found. Please install Hyperledger Fabric binaries."
        exit 1
    fi
    
    # Generate orderer crypto materials
    if [ -f "./network/organizations/cryptogen/crypto-config-orderer.yaml" ]; then
        if command -v cryptogen &> /dev/null; then
            cryptogen generate --config=./network/organizations/cryptogen/crypto-config-orderer.yaml --output=./network/organizations
        elif [ -f "./bin/cryptogen" ]; then
            ./bin/cryptogen generate --config=./network/organizations/cryptogen/crypto-config-orderer.yaml --output=./network/organizations
        fi
    fi
    
    print_success "Crypto materials generated successfully"
}

# Generate genesis block and channel artifacts
generate_artifacts() {
    print_status "Generating genesis block and channel artifacts..."
    
    export FABRIC_CFG_PATH=${PWD}/network
    
    # Generate genesis block
    print_status "Generating genesis block..."
    if command -v configtxgen &> /dev/null; then
        configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock ./network/system-genesis-block/genesis.block
    elif [ -f "./bin/configtxgen" ]; then
        ./bin/configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock ./network/system-genesis-block/genesis.block
    else
        print_error "configtxgen tool not found. Please install Hyperledger Fabric binaries."
        exit 1
    fi
    
    # Generate channel configuration transaction
    print_status "Generating channel configuration..."
    if command -v configtxgen &> /dev/null; then
        configtxgen -profile CoffeeExportChannel -outputCreateChannelTx ./network/channel-artifacts/coffeeexport.tx -channelID coffeeexport
    elif [ -f "./bin/configtxgen" ]; then
        ./bin/configtxgen -profile CoffeeExportChannel -outputCreateChannelTx ./network/channel-artifacts/coffeeexport.tx -channelID coffeeexport
    fi
    
    # Generate anchor peer transactions for each organization
    print_status "Generating anchor peer transactions..."
    
    organizations=("NationalBankMSP" "ExporterBankMSP" "CoffeeAuthorityMSP" "CustomsMSP" "ExporterMSP")
    
    for org in "${organizations[@]}"; do
        print_status "Generating anchor peer transaction for $org..."
        if command -v configtxgen &> /dev/null; then
            configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate ./network/channel-artifacts/${org}anchors.tx -channelID coffeeexport -asOrg $org
        elif [ -f "./bin/configtxgen" ]; then
            ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate ./network/channel-artifacts/${org}anchors.tx -channelID coffeeexport -asOrg $org
        fi
    done
    
    print_success "Genesis block and channel artifacts generated successfully"
}

# Set up environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Coffee Export Platform Environment Variables

# Test hash values for validators
TEST_LICENSE_HASH=a1b2c3d4e5f6789012345
TEST_INVOICE_HASH=x9y8z7w6v5u4t3s2r1q0
TEST_QUALITY_HASH=q1w2e3r4t5y6u7i8o9p0
TEST_SHIPPING_HASH=s1h2i3p4p5i6n7g8h9a0

# Fabric settings
FABRIC_CFG_PATH=./network

# Compose settings
COMPOSE_PROJECT_NAME=coffeeexport
EOF
        print_success "Created .env file with default values"
    else
        print_status ".env file already exists"
    fi
}

# Start the network
start_network() {
    print_status "Starting the blockchain network..."
    
    # Export environment variables
    export FABRIC_CFG_PATH=${PWD}/network
    
    # Start the network
    docker-compose up -d orderer.coffee-consortium.com
    sleep 5
    
    # Start peer organizations
    docker-compose up -d \
        couchdb.nationalbank.com \
        couchdb.exporterbank.com \
        couchdb.coffeeauthority.com \
        couchdb.customs.com \
        couchdb.exporter.com
    
    sleep 10
    
    docker-compose up -d \
        peer0.nationalbank.com \
        peer0.exporterbank.com \
        peer0.coffeeauthority.com \
        peer0.customs.com \
        peer0.exporter.com
    
    sleep 5
    
    # Start CLI and IPFS
    docker-compose up -d cli ipfs
    
    print_success "Blockchain network started successfully"
}

# Create and join channel
setup_channel() {
    print_status "Setting up channel..."
    
    # Wait for services to be ready
    sleep 10
    
    print_status "Creating channel..."
    docker exec cli peer channel create \
        -o orderer.coffee-consortium.com:7050 \
        -c coffeeexport \
        -f /etc/hyperledger/fabric/channel-artifacts/coffeeexport.tx \
        --tls true \
        --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/tls/ca.crt
    
    # Join all peers to the channel
    organizations=("nationalbank.com" "exporterbank.com" "coffeeauthority.com" "customs.com" "exporter.com")
    msps=("NationalBankMSP" "ExporterBankMSP" "CoffeeAuthorityMSP" "CustomsMSP" "ExporterMSP")
    ports=("7051" "8051" "9051" "10051" "11051")
    
    for i in "${!organizations[@]}"; do
        org="${organizations[$i]}"
        msp="${msps[$i]}"
        port="${ports[$i]}"
        
        print_status "Joining $org to channel..."
        
        docker exec -e CORE_PEER_LOCALMSPID=$msp \
            -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/$org/peers/peer0.$org/tls/ca.crt \
            -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/$org/users/Admin@$org/msp \
            -e CORE_PEER_ADDRESS=peer0.$org:$port \
            cli peer channel join -b coffeeexport.block
    done
    
    print_success "Channel setup completed"
}

# Start validator services
start_validators() {
    print_status "Starting validator services..."
    
    docker-compose up -d \
        national-bank-validator \
        bank-api-validator \
        quality-authority-validator \
        customs-validator \
        api-gateway
    
    print_success "Validator services started"
}

# Verify network
verify_network() {
    print_status "Verifying network setup..."
    
    # Check if all containers are running
    print_status "Checking container status..."
    if docker-compose ps | grep -q "Exit"; then
        print_warning "Some containers have exited. Check logs with: docker-compose logs"
    else
        print_success "All containers are running"
    fi
    
    # Test connectivity
    print_status "Testing peer connectivity..."
    docker exec cli peer channel list
    
    print_success "Network verification completed"
}

# Main execution
main() {
    print_header
    
    print_status "This script will set up the Coffee Export Platform with the new Exporter organization."
    print_status "The following organizations will be included:"
    print_status "  - National Bank (Validator)"
    print_status "  - Exporter Bank (Financial Services)"
    print_status "  - Coffee Authority (Quality Control)"
    print_status "  - Customs (Import/Export Control)"
    print_status "  - Exporter (Coffee Exporters) - NEW"
    echo
    
    read -p "Do you want to continue? [y/N] " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
    
    # Execute setup steps
    check_prerequisites
    cleanup_network
    setup_environment
    generate_crypto
    generate_artifacts
    start_network
    setup_channel
    start_validators
    verify_network
    
    print_success "Network setup completed successfully!"
    echo
    print_status "Network Information:"
    print_status "  - Orderer: orderer.coffee-consortium.com:7050"
    print_status "  - National Bank Peer: peer0.nationalbank.com:7051"
    print_status "  - Exporter Bank Peer: peer0.exporterbank.com:8051"
    print_status "  - Coffee Authority Peer: peer0.coffeeauthority.com:9051"
    print_status "  - Customs Peer: peer0.customs.com:10051"
    print_status "  - Exporter Peer: peer0.exporter.com:11051"
    print_status "  - API Gateway: http://localhost:8000"
    print_status "  - IPFS: http://localhost:5001"
    echo
    print_status "You can now deploy chaincode and start using the platform!"
}

# Run main function
main "$@"