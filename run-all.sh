#!/bin/bash

export PATH=${PWD}/bin:$PATH

set -ex

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
CHANNEL_NAME="coffeeexport"
SEQUENCE="1"

# Directories
NET_DIR="./network"
ORGS_DIR="${NET_DIR}/organizations"
GENESIS_DIR="${NET_DIR}/system-genesis-block"
CHANNEL_ARTIFACTS_DIR="${NET_DIR}/channel-artifacts"

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
    rm -rf "${ORGS_DIR}" "${GENESIS_DIR}" "${CHANNEL_ARTIFACTS_DIR}"
    rm -f ./*.tar.gz log.txt package_id.txt
    
    print_success "Cleanup complete."
}

# Generate all required cryptographic material and configuration transactions
generate_artifacts() {
    print_header "Generating Network Artifacts"
    
    # Generate crypto material for all organizations
    print_status "Generating crypto material using 'cryptogen'..."
    export FABRIC_CFG_PATH="${NET_DIR}"
    mkdir -p "${ORGS_DIR}"
    cryptogen generate --config="${ORGS_DIR}/cryptogen/crypto-config-orderer.yaml" --output="${ORGS_DIR}"
    cryptogen generate --config="${ORGS_DIR}/cryptogen/crypto-config.yaml" --output="${ORGS_DIR}"
    print_success "Crypto material generated."

    # Create the system channel genesis block
    print_status "Generating genesis block using 'configtxgen'..."
    mkdir -p "${GENESIS_DIR}"
    configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock "${GENESIS_DIR}/genesis.block" -configPath "${NET_DIR}"
    print_success "Genesis block created."

    # Create the application channel transaction
    print_status "Generating channel configuration transaction..."
    mkdir -p "${CHANNEL_ARTIFACTS_DIR}"
    configtxgen -profile CoffeeExportChannel -outputCreateChannelTx "${CHANNEL_ARTIFACTS_DIR}/coffeeexport.tx" -channelID "$CHANNEL_NAME" -configPath "${NET_DIR}"
    print_success "Channel transaction created."

    # Generate anchor peer update transactions for each organization
    print_status "Generating anchor peer updates..."
    for org in NationalBank ExporterBank CoffeeAuthority Customs; do
        configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate "${CHANNEL_ARTIFACTS_DIR}/${org}MSPanchors.tx" -channelID "$CHANNEL_NAME" -asOrg "${org}MSP" -configPath "${NET_DIR}"
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
    print_status "Creating channel '$CHANNEL_NAME'..."
    # Define the orderer CA path
    ORDERER_CA="/etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem"
    
    # Create the channel using the orderer's TLS CA cert
    docker-compose exec -T cli bash -c "
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID=\"NationalBankMSP\"
    export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
    export CORE_PEER_ADDRESS=peer0.nationalbank.com:7051

    peer channel create \
        -o orderer.coffee-consortium.com:7050 \
        -c $CHANNEL_NAME \
        -f /etc/hyperledger/fabric/channel-artifacts/coffeeexport.tx \
        --outputBlock /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block \
        --tls \
        --cafile $ORDERER_CA
    "
    
    docker-compose exec -T cli ls -l /etc/hyperledger/fabric/channel-artifacts/

    print_success "Channel created."
}

# Join all peers to the channel
join_channel() {
    print_header "Joining Peers to Channel"

    for org in nationalbank exporterbank coffeeauthority customs; do
        print_status "Joining peer for ${org}..."

        case "$org" in
          nationalbank)
            MSP="NationalBankMSP"; PORT=7051 ;;
          exporterbank)
            MSP="ExporterBankMSP"; PORT=8051 ;;
          coffeeauthority)
            MSP="CoffeeAuthorityMSP"; PORT=9051 ;;
          customs)
            MSP="CustomsMSP"; PORT=10051 ;;
        esac

        docker-compose exec -T cli bash -c "
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=\"${MSP}\"
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/users/Admin@${org}.com/msp
export CORE_PEER_ADDRESS=peer0.${org}.com:${PORT}

peer channel join -b /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block
"
        print_success "Peer for ${org} has joined the channel."
    done
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
    join_channel
}

main "$@"