#!/bin/bash

set -x

export TEST_INVOICE_HASH="dummy_invoice_hash"
export TEST_QUALITY_HASH="dummy_quality_hash"
export TEST_LICENSE_HASH="dummy_license_hash"
export TEST_SHIPPING_HASH="dummy_shipping_hash"

# --- Configuration ---
# ---------------------

# Colors for consistently styled output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Chaincode and channel configuration
CHAINCODE_NAME="coffeeexport"
CHAINCODE_VERSION="1.0"
CHAINCODE_PATH="github.com/chaincode"
CHANNEL_NAME="coffeeexport"
SEQUENCE="1"

# --- Utility Functions ---
# -------------------------

# Print a formatted status message
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Print a formatted success message
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Print a formatted warning message
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Print a formatted error message and exit
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Print a section header
print_header() {
    echo -e "${BLUE}"
    echo "=================================================================="
    echo "  $1"
    echo "=================================================================="
    echo -e "${NC}"
}

# --- Network Operations ---
# --------------------------

# Clean up all generated artifacts and shut down the network
cleanup_network() {
    print_header "Cleaning Up Previous Network"
    # Shut down all running containers and remove volumes
    docker-compose down -v --remove-orphans 2>/dev/null || true
    
    # Remove directories and files created by scripts
    rm -rf organizations/ system-genesis-block/ channel-artifacts/
    rm -f ./*.tar.gz log.txt package_id.txt
    
    print_success "Cleanup complete."
}

# Generate all required cryptographic material and configuration transactions
generate_artifacts() {
    print_header "Generating Network Artifacts"
    
    # Generate crypto material for all organizations
    print_status "Generating crypto material using 'cryptogen' ભા..."
    cryptogen generate --config=./network/organizations/cryptogen/crypto-config-orderer.yaml --output="./organizations"
    cryptogen generate --config=./network/organizations/cryptogen/crypto-config.yaml --output="./organizations"
    print_success "Crypto material generated."
    ls -l organizations/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp/admincerts

    # Create the system channel genesis block
    print_status "Generating genesis block using 'configtxgen' ભા..."
    mkdir -p system-genesis-block
    configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block -configPath ./network
    print_success "Genesis block created."

    # Create the application channel transaction
    print_status "Generating channel configuration transaction..."
    mkdir -p ./network/channel-artifacts
    configtxgen -profile CoffeeExportChannel -outputCreateChannelTx ./network/channel-artifacts/coffeeexport.tx -channelID $CHANNEL_NAME -configPath ./network
    print_success "Channel transaction created."

    # Generate anchor peer update transactions for each organization
    print_status "Generating anchor peer updates..."
    for org in NationalBank ExporterBank CoffeeAuthority Customs; do
        configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate ./network/channel-artifacts/${org}MSPanchors.tx -channelID $CHANNEL_NAME -asOrg ${org}MSP -configPath ./network
    done
    print_success "Anchor peer updates created."
}

# Start the Fabric network and create/join the channel
setup_and_start_network() {
    print_header "Starting Hyperledger Fabric Network"
    
    # Start all services defined in docker-compose in detached mode
    docker-compose up -d
    print_success "All network services started."

    # Wait a moment for containers to initialize
    print_status "Waiting for network to stabilize..."
    sleep 10

    # Create the channel
    print_status "Creating channel '$CHANNEL_NAME' ભા..."
    docker-compose exec cli bash -c "
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=\"NationalBankMSP\"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
export CORE_PEER_ADDRESS=peer0.nationalbank.com:7051
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem

peer channel create \
    -o orderer.coffee-consortium.com:7050 \
    -c $CHANNEL_NAME \
    -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/coffeeexport.tx \
    --outputBlock /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/coffeeexport.block \
    --tls \
    --cafile \$ORDERER_CA
"
    print_success "Channel created."
}


# Main function to orchestrate the setup
main() {
    # Stop and clean up the network if 'down' argument is provided
    if [ "$1" == "down" ]; then
        cleanup_network
        exit 0
    fi

    # --- Execution Flow ---
    cleanup_network
    generate_artifacts
    setup_and_start_network
}

main "$@"