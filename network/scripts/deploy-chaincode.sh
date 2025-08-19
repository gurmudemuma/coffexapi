#!/bin/bash

# Coffee Export Chaincode Deployment Script
# This script deploys the coffee export smart contract to the consortium network

set -e

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

# Chaincode configuration
CHAINCODE_NAME="coffeeexport"
CHAINCODE_VERSION="1.0"
CHAINCODE_PATH="github.com/hyperledger/fabric-samples/chaincode/coffeeexport"
CHANNEL_NAME="coffeeexport"
SEQUENCE="1"

# Set environment variables for National Bank (initiator)
set_nationalbank_env() {
    export CORE_PEER_TLS_ENABLED=false
    export CORE_PEER_LOCALMSPID="NationalBankMSP"
    export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
    export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
    export CORE_PEER_ADDRESS=localhost:7051
}

# Set environment variables for other organizations
set_org_env() {
    local org=$1
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
}

# Package the chaincode
package_chaincode() {
    print_status "Packaging chaincode..."
    
    set_nationalbank_env
    
    docker exec peer0.nationalbank.com peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz \
        --path ${CHAINCODE_PATH} \
        --lang golang \
        --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}
    
    print_success "Chaincode packaged successfully"
}

# Install chaincode on all peers
install_chaincode() {
    print_status "Installing chaincode on all peers..."
    
    for org in nationalbank exporterbank coffeeauthority customs; do
        print_status "Installing on ${org} peer..."
        set_org_env $org
        
        docker exec peer0.${org}.com peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz
        
        print_success "Chaincode installed on ${org} peer"
    done
}

# Query installed chaincode
query_installed() {
    print_status "Querying installed chaincode..."
    
    set_nationalbank_env
    
    docker exec peer0.nationalbank.com peer lifecycle chaincode queryinstalled >&log.txt
    
    PACKAGE_ID=$(sed -n "/${CHAINCODE_NAME}_${CHAINCODE_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    
    print_success "Package ID: $PACKAGE_ID"
    echo $PACKAGE_ID > package_id.txt
}

# Approve chaincode for all organizations
approve_chaincode() {
    print_status "Approving chaincode for all organizations..."
    
    PACKAGE_ID=$(cat package_id.txt)
    
    for org in nationalbank exporterbank coffeeauthority customs; do
        print_status "Approving for ${org}..."
        set_org_env $org
        
        docker exec peer0.${org}.com peer lifecycle chaincode approveformyorg \
            -o localhost:7050 \
            --channelID ${CHANNEL_NAME} \
            --name ${CHAINCODE_NAME} \
            --version ${CHAINCODE_VERSION} \
            --package-id ${PACKAGE_ID} \
            --sequence ${SEQUENCE}
        
        print_success "Chaincode approved for ${org}"
    done
}

# Check commit readiness
check_commit_readiness() {
    print_status "Checking commit readiness..."
    
    set_nationalbank_env
    
    docker exec peer0.nationalbank.com peer lifecycle chaincode checkcommitreadiness \
        --channelID ${CHANNEL_NAME} \
        --name ${CHAINCODE_NAME} \
        --version ${CHAINCODE_VERSION} \
        --sequence ${SEQUENCE} \
        --output json
    
    print_success "Commit readiness checked"
}

# Commit chaincode definition
commit_chaincode() {
    print_status "Committing chaincode definition..."
    
    set_nationalbank_env
    
    docker exec peer0.nationalbank.com peer lifecycle chaincode commit \
        -o localhost:7050 \
        --channelID ${CHANNEL_NAME} \
        --name ${CHAINCODE_NAME} \
        --version ${CHAINCODE_VERSION} \
        --sequence ${SEQUENCE}
    
    print_success "Chaincode definition committed"
}

# Query committed chaincode
query_committed() {
    print_status "Querying committed chaincode..."
    
    set_nationalbank_env
    
    docker exec peer0.nationalbank.com peer lifecycle chaincode querycommitted \
        --channelID ${CHANNEL_NAME} \
        --name ${CHAINCODE_NAME}
    
    print_success "Chaincode query completed"
}

# Initialize chaincode (if needed)
initialize_chaincode() {
    print_status "Initializing chaincode..."
    
    set_nationalbank_env
    
    # Initialize with some default data
    docker exec peer0.nationalbank.com peer chaincode invoke \
        -o localhost:7050 \
        -C ${CHANNEL_NAME} \
        -n ${CHAINCODE_NAME} \
        --isInit \
        -c '{"Args":["InitLedger"]}'
    
    print_success "Chaincode initialized"
}

# Main execution
main() {
    print_status "Starting Coffee Export Chaincode Deployment"
    print_status "============================================"
    
    # Check if network is running
    if ! docker ps | grep -q "peer0.nationalbank.com"; then
        print_error "Network is not running. Please start the network first."
        exit 1
    fi
    
    package_chaincode
    install_chaincode
    query_installed
    approve_chaincode
    check_commit_readiness
    commit_chaincode
    query_committed
    initialize_chaincode
    
    print_success "Coffee Export Chaincode deployed successfully!"
    print_status "Chaincode details:"
    echo "  - Name: $CHAINCODE_NAME"
    echo "  - Version: $CHAINCODE_VERSION"
    echo "  - Channel: $CHANNEL_NAME"
    echo "  - Sequence: $SEQUENCE"
}

# Run main function
main "$@"
