#!/bin/bash

# Coffee Export Chaincode Deployment Script
# This script joins peers to the channel and deploys the coffee export smart contract.

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Chaincode configuration
CHAINCODE_NAME="coffeeexport"
CHAINCODE_VERSION="1.0"
CHAINCODE_PATH="github.com/chaincode"
CHANNEL_NAME="coffeeexport"
SEQUENCE="1"
ORDERER_CA_FILE="/etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem"

# Set environment variables for a specific organization
set_org_env() {
    local org_name=$1
    local org_domain="${org_name}.com"
    local peer_address="peer0.${org_domain}"
    local peer_port

    case $org_name in
        "nationalbank") peer_port=7051 ;;
        "exporterbank") peer_port=8051 ;;
        "coffeeauthority") peer_port=9051 ;;
        "customs") peer_port=10051 ;;
        *) print_error "Unknown organization: $org_name"; exit 1 ;;
    esac

    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="${org_name^}MSP"
    export CORE_PEER_MSPCONFIGPATH="/etc/hyperledger/fabric/organizations/peerOrganizations/${org_domain}/users/Admin@${org_domain}/msp"
    export CORE_PEER_TLS_ROOTCERT_FILE="/etc/hyperledger/fabric/organizations/peerOrganizations/${org_domain}/peers/${peer_address}/tls/ca.crt"
    export CORE_PEER_ADDRESS="${peer_address}:${peer_port}"
}

# Package the chaincode
package_chaincode() {
    print_status "Packaging chaincode..."
    set_org_env "nationalbank"
    docker-compose exec cli peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ${CHAINCODE_PATH} --lang golang --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}
    print_success "Chaincode packaged successfully"
}

# Install chaincode on all peers
install_chaincode() {
    print_status "Installing chaincode on all peers..."
    for org in nationalbank exporterbank coffeeauthority customs; do
        print_status "Installing on ${org} peer..."
        set_org_env $org
        docker-compose exec cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz
        print_success "Chaincode installed on ${org} peer"
    done
}

# Query installed chaincode to get the Package ID
query_installed() {
    print_status "Querying installed chaincode on NationalBank peer..."
    set_org_env "nationalbank"
    docker-compose exec cli peer lifecycle chaincode queryinstalled >&log.txt
    PACKAGE_ID=$(sed -n "/${CHAINCODE_NAME}_${CHAINCODE_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    if [ -z "$PACKAGE_ID" ]; then
        print_error "Could not find package ID for chaincode. Exiting."
        exit 1
    fi
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
        docker-compose exec cli peer lifecycle chaincode approveformyorg -o orderer.coffee-consortium.com:7050 --tls --cafile ${ORDERER_CA_FILE} --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version ${CHAINCODE_VERSION} --package-id ${PACKAGE_ID} --sequence ${SEQUENCE}
        print_success "Chaincode approved for ${org}"
    done
}

# Check commit readiness
check_commit_readiness() {
    print_status "Checking commit readiness..."
    set_org_env "nationalbank"
    docker-compose exec cli peer lifecycle chaincode checkcommitreadiness --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version ${CHAINCODE_VERSION} --sequence ${SEQUENCE} --tls --cafile ${ORDERER_CA_FILE} --output json
    print_success "Commit readiness checked"
}

# Commit chaincode definition
commit_chaincode() {
    print_status "Committing chaincode definition..."
    set_org_env "nationalbank"
    # Committing requires specifying the peer addresses of other orgs for endorsement
    docker-compose exec cli peer lifecycle chaincode commit -o orderer.coffee-consortium.com:7050 --tls --cafile ${ORDERER_CA_FILE} --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version ${CHAINCODE_VERSION} --sequence ${SEQUENCE} --peerAddresses peer0.nationalbank.com:7051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt --peerAddresses peer0.exporterbank.com:8051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/exporterbank.com/peers/peer0.exporterbank.com/tls/ca.crt --peerAddresses peer0.coffeeauthority.com:9051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/coffeeauthority.com/peers/peer0.coffeeauthority.com/tls/ca.crt --peerAddresses peer0.customs.com:10051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/customs.com/peers/peer0.customs.com/tls/ca.crt
    print_success "Chaincode definition committed"
}

# Query committed chaincode
query_committed() {
    print_status "Querying committed chaincode..."
    set_org_env "nationalbank"
    docker-compose exec cli peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --cafile ${ORDERER_CA_FILE}
    print_success "Chaincode query completed"
}

# Initialize chaincode
initialize_chaincode() {
    print_status "Initializing chaincode..."
    set_org_env "nationalbank"
    # Initializing requires specifying the peer addresses of other orgs for endorsement
    docker-compose exec cli peer chaincode invoke -o orderer.coffee-consortium.com:7050 --tls --cafile ${ORDERER_CA_FILE} -C ${CHANNEL_NAME} -n ${CHAINCODE_NAME} --isInit -c '{"Args":["InitLedger"]}' --peerAddresses peer0.nationalbank.com:7051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt --peerAddresses peerer.exporterbank.com:8051 --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/exporterbank.com/peers/peer0.exporterbank.com/tls/ca.crt
    print_success "Chaincode initialized"
}

# Main execution
main() {
    print_status "Starting Coffee Export Chaincode Deployment"
    print_status "============================================="
    
    if ! docker ps | grep -q "peer0.nationalbank.com"; then
        print_error "Network is not running. Please start the network first."
    fi
    
    package_chaincode
    install_chaincode
    query_installed
    approve_chaincode
    check_commit_readiness
    commit_chaincode
    query_committed
    # initialize_chaincode # Init is not always needed with the new lifecycle
    
    print_success "Coffee Export Chaincode deployed successfully!"
}

# Run main function
main "$@"
