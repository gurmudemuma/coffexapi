#!/bin/bash

# Coffee Export Consortium Network Setup Script
# This script sets up a complete Hyperledger Fabric consortium network

set -e
export PATH=$BIN_DIR:$PATH

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
BIN_DIR="$(cd "$(dirname "$0")/../../bin" && pwd)"
export PATH=$BIN_DIR:$PATH

# Verify binaries exist
if [ ! -f "$BIN_DIR/cryptogen" ] || [ ! -f "$BIN_DIR/configtxgen" ]; then
    print_error "Hyperledger Fabric binaries not found in $BIN_DIR"
    exit 1
fi

echo "Using Hyperledger Fabric binaries from: $BIN_DIR"

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v cryptogen &> /dev/null; then
        print_warning "cryptogen not found. Please install Hyperledger Fabric binaries."
        print_status "You can download them from: https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
        exit 1
    fi
    
    if ! command -v configtxgen &> /dev/null; then
        print_warning "configtxgen not found. Please install Hyperledger Fabric binaries."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Clean up previous network artifacts
cleanup() {
    print_status "Cleaning up previous network artifacts..."
    
    # Stop and remove containers
    (cd .. && docker-compose down -v 2>/dev/null || true)
    
    # Remove generated artifacts
    rm -rf ../organizations/peerOrganizations
    rm -rf ../organizations/ordererOrganizations
    rm -rf ../system-genesis-block
    rm -rf ../channel-artifacts
    
    print_success "Cleanup completed"
}

# Generate crypto materials for all organizations
generate_crypto() {
    print_status "Generating crypto materials for all organizations..."
    
    # Define the base directory
    local BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
    
    # Create organizations directory
    mkdir -p "$BASE_DIR/organizations/peerOrganizations"
    mkdir -p "$BASE_DIR/organizations/ordererOrganizations"
    
    # Generate crypto for orderer
    if ! "$BIN_DIR/cryptogen" generate --config="$BASE_DIR/organizations/cryptogen/crypto-config-orderer.yaml" --output="$BASE_DIR/organizations"; then
        print_error "Failed to generate crypto material"
        return 1
    fi
    
    # Generate crypto for all peer organizations using the main config file
    if ! "$BIN_DIR/cryptogen" generate --config="$BASE_DIR/organizations/cryptogen/crypto-config.yaml" --output="$BASE_DIR/organizations"; then
        print_error "Failed to generate crypto material"
        return 1
    fi
    
    print_success "Crypto materials generated"
}

# Generate system genesis block
generate_genesis() {
    print_status "Generating system genesis block..."
    
    # Define the base directory
    local BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
    
    # Create system-genesis-block directory if it doesn't exist
    mkdir -p "$BASE_DIR/system-genesis-block"
    
    # Run configtxgen with the correct FABRIC_CFG_PATH
    export FABRIC_CFG_PATH=$BASE_DIR
    if ! "$BIN_DIR/configtxgen" -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock "$BASE_DIR/system-genesis-block/genesis.block"; then
        print_error "Failed to generate genesis block"
        return 1
    fi
    
    print_success "Genesis block generated"
}

# Generate channel configuration transaction
generate_channel_tx() {
    print_status "Generating channel configuration transaction..."
    
    # Define the base directory
    local BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
    
    # Create channel-artifacts directory if it doesn't exist
    mkdir -p "$BASE_DIR/channel-artifacts"
    
    # Run configtxgen with the correct FABRIC_CFG_PATH
    export FABRIC_CFG_PATH=$BASE_DIR
    if ! "$BIN_DIR/configtxgen" -profile CoffeeExportChannel -outputCreateChannelTx "$BASE_DIR/channel-artifacts/channel.tx" -channelID coffeeexport; then
        print_error "Failed to generate channel configuration transaction"
        return 1
    fi
    
    print_success "Channel configuration transaction generated"
}

# Generate anchor peer transactions
generate_anchor_peers() {
    print_status "Generating anchor peer transactions..."
    
    # Define the base directory
    local BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
    
    # Create channel-artifacts directory if it doesn't exist
    mkdir -p "$BASE_DIR/channel-artifacts"
    
    # Generate anchor peer transactions for each organization
    export FABRIC_CFG_PATH=$BASE_DIR
    (cd "$BASE_DIR" && \
     FABRIC_CFG_PATH="$BASE_DIR" "$BIN_DIR/configtxgen" \
     -profile CoffeeExportChannel \
     -outputAnchorPeersUpdate "$BASE_DIR/channel-artifacts/NationalBankMSPanchors.tx" \
     -channelID coffeeexport \
     -asOrg NationalBankMSP)
     
    (cd "$BASE_DIR" && \
     FABRIC_CFG_PATH="$BASE_DIR" "$BIN_DIR/configtxgen" \
     -profile CoffeeExportChannel \
     -outputAnchorPeersUpdate "$BASE_DIR/channel-artifacts/ExporterBankMSPanchors.tx" \
     -channelID coffeeexport \
     -asOrg ExporterBankMSP)
     
    (cd "$BASE_DIR" && \
     FABRIC_CFG_PATH="$BASE_DIR" "$BIN_DIR/configtxgen" \
     -profile CoffeeExportChannel \
     -outputAnchorPeersUpdate "$BASE_DIR/channel-artifacts/CoffeeAuthorityMSPanchors.tx" \
     -channelID coffeeexport \
     -asOrg CoffeeAuthorityMSP)
     
    (cd "$BASE_DIR" && \
     FABRIC_CFG_PATH="$BASE_DIR" "$BIN_DIR/configtxgen" \
     -profile CoffeeExportChannel \
     -outputAnchorPeersUpdate "$BASE_DIR/channel-artifacts/CustomsMSPanchors.tx" \
     -channelID coffeeexport \
     -asOrg CustomsMSP)
    
    print_success "Anchor peer transactions generated"
}

# Start the network
start_network() {
    print_status "Starting the consortium network..."
    
    # Define the base directory
    local BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
    
    # Ensure the channel-artifacts directory exists
    mkdir -p "$BASE_DIR/network/channel-artifacts"
    
    # Create a symbolic link from the expected location to the actual location
    if [ ! -f "$BASE_DIR/network/channel-artifacts/coffeeexport.block" ]; then
        ln -s "$BASE_DIR/network/system-genesis-block/genesis.block" "$BASE_DIR/network/channel-artifacts/coffeeexport.block"
    fi
    
    # Start the network using the docker-compose file in the project root
    (cd "$BASE_DIR" && docker-compose -f docker-compose.yaml up -d)
    
    # Check if the command was successful
    if [ $? -ne 0 ]; then
        print_error "Failed to start the network. Check the Docker Compose logs for details."
        return 1
    fi
    
    print_success "Network started successfully"
}

# Wait for network to be ready
wait_for_network() {
    print_status "Waiting for network to be ready..."
    
    # Wait for orderer
    until docker exec orderer.coffee-consortium.com ls /var/hyperledger/orderer/orderer.genesis.block > /dev/null 2>&1; do
        sleep 1
    done
    
    # Wait for peers
    for org in nationalbank exporterbank coffeeauthority customs; do
        until docker exec peer0.${org}.com ls /etc/hyperledger/fabric/msp > /dev/null 2>&1; do
            sleep 1
        done
    done
    
    print_success "Network is ready"
}

# Create and join channel
create_channel() {
    print_status "Creating and joining channel..."
    
    # Set environment variables for National Bank
    export CORE_PEER_TLS_ENABLED=false
    export CORE_PEER_LOCALMSPID="NationalBankMSP"
    export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
    export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
    export CORE_PEER_ADDRESS=localhost:7051
    
    # Define the base directory inside the container
    local CONTAINER_BASE_DIR="/opt/gopath/src/github.com/hyperledger/fabric/peer"
    
    # Create necessary directories in the container
    docker exec cli mkdir -p $CONTAINER_BASE_DIR/channel-artifacts
    
    
    
    # Create channel with the updated configuration
    docker exec \
        -e CORE_PEER_MSPCONFIGPATH=$CONTAINER_BASE_DIR/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp \
        -e CORE_PEER_LOCALMSPID=NationalBankMSP \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_TLS_ROOTCERT_FILE=$CONTAINER_BASE_DIR/crypto/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt \
        -e CORE_PEER_ADDRESS=peer0.nationalbank.com:7051 \
        -e CORE_PEER_ADMIN=true \
        cli peer channel create \
        -o orderer.coffee-consortium.com:7050 \
        -c coffeeexport \
        -f $CONTAINER_BASE_DIR/channel-artifacts/channel.tx \
        --outputBlock $CONTAINER_BASE_DIR/channel-artifacts/coffeeexport.block \
        --tls \
        --cafile $CONTAINER_BASE_DIR/crypto/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem \
        --clientauth \
        --keyfile $CONTAINER_BASE_DIR/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/tls/client.key \
        --certfile $CONTAINER_BASE_DIR/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/tls/client.crt
    
    # Join channel for all organizations with TLS
    for org in nationalbank exporterbank coffeeauthority customs; do
        # Set peer address based on organization
        case $org in
            "nationalbank")
                peer_port=7051
                ;;
            "exporterbank")
                peer_port=8051
                ;;
            "coffeeauthority")
                peer_port=9051
                ;;
            "customs")
                peer_port=10051
                ;;
        esac

        # Join channel with TLS
        docker exec \
            -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/users/Admin@${org}.com/msp \
            -e CORE_PEER_LOCALMSPID="${org^}MSP" \
            -e CORE_PEER_TLS_ENABLED=true \
            -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt \
            -e CORE_PEER_ADDRESS=peer0.${org}.com:${peer_port} \
            cli peer channel join -b /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block --tls \
            --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem
    done
    
    print_success "Channel created and joined successfully"
}

# Update anchor peers
update_anchor_peers() {
    print_status "Updating anchor peers..."
    
    for org in nationalbank exporterbank coffeeauthority customs; do
        export CORE_PEER_LOCALMSPID="${org^}MSP"
        export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${org}.com/users/Admin@${org}.com/msp
        export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt
        
        case $org in
            "nationalbank")
                export CORE_PEER_ADDRESS=localhost:7051
                ;;
            "exporterbank")
                export CORE_PEER_ADDRESS=localhost:8051
                ;;
            "coffeeauthority")
                export CORE_PEER_ADDRESS=localhost:9051
                ;;
            "customs")
                export CORE_PEER_ADDRESS=localhost:10051
                ;;
        esac
        
        docker exec peer0.${org}.com peer channel update -o orderer.coffee-consortium.com:7050 -c coffeeexport -f /etc/hyperledger/fabric/channel-artifacts/${org^}MSPanchors.tx
    done
    
    print_success "Anchor peers updated successfully"
}

# Main execution
main() {
    print_status "Starting Coffee Export Consortium Network Setup"
    print_status "================================================"
    
    check_prerequisites
    cleanup
    generate_crypto
    generate_genesis
    generate_channel_tx
    generate_anchor_peers
    start_network
    wait_for_network
    create_channel
    update_anchor_peers
    
    print_success "Coffee Export Consortium Network is ready!"
    print_status "Network endpoints:"
    echo "  - Orderer: localhost:7050"
    echo "  - National Bank Peer: localhost:7051"
    echo "  - Exporter Bank Peer: localhost:8051"
    echo "  - Coffee Authority Peer: localhost:9051"
    echo "  - Customs Peer: localhost:10051"
    echo "  - CouchDB instances: localhost:5984, 6984, 7984, 8984"
}

# Run main function
main "$@"
