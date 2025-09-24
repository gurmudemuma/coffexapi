#!/bin/bash

# Coffee Export Chaincode Deployment Script
# Deploys the coffee export chaincode to all peers in the consortium

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

# Configuration
CHANNEL_NAME="coffeeexport"
CHAINCODE_NAME="coffee_export"
CHAINCODE_VERSION="1.0"
CHAINCODE_PATH="/opt/gopath/src/github.com/chaincode/go"
CHAINCODE_LANG="golang"

# Package chaincode
package_chaincode() {
    print_status "Packaging chaincode..."
    
    docker exec cli peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz \
        --path ${CHAINCODE_PATH} \
        --lang ${CHAINCODE_LANG} \
        --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}
    
    print_success "Chaincode packaged successfully"
}

# Install chaincode on all peers
install_chaincode() {
    print_status "Installing chaincode on all peers..."
    
    for org in nationalbank exporterbank coffeeauthority customs; do
        case $org in
            "nationalbank") peer_port=7051; msp="NationalBankMSP" ;;
            "exporterbank") peer_port=8051; msp="ExporterBankMSP" ;;
            "coffeeauthority") peer_port=9051; msp="CoffeeAuthorityMSP" ;;
            "customs") peer_port=10051; msp="CustomsMSP" ;;
        esac
        
        print_status "Installing on ${org} peer..."
        
        docker exec \
            -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/users/Admin@${org}.com/msp \
            -e CORE_PEER_LOCALMSPID=$msp \
            -e CORE_PEER_TLS_ENABLED=true \
            -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt \
            -e CORE_PEER_ADDRESS=peer0.${org}.com:${peer_port} \
            cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz
    done
    
    print_success "Chaincode installed on all peers"
}

# Get package ID
get_package_id() {
    print_status "Getting chaincode package ID..."
    
    PACKAGE_ID=$(docker exec cli peer lifecycle chaincode queryinstalled --output json | jq -r ".installed_chaincodes[0].package_id")
    
    if [ "$PACKAGE_ID" = "null" ] || [ -z "$PACKAGE_ID" ]; then
        print_error "Failed to get package ID"
        exit 1
    fi
    
    print_success "Package ID: $PACKAGE_ID"
}

# Approve chaincode for each organization
approve_chaincode() {
    print_status "Approving chaincode for all organizations..."
    
    for org in nationalbank exporterbank coffeeauthority customs; do
        case $org in
            "nationalbank") peer_port=7051; msp="NationalBankMSP" ;;
            "exporterbank") peer_port=8051; msp="ExporterBankMSP" ;;
            "coffeeauthority") peer_port=9051; msp="CoffeeAuthorityMSP" ;;
            "customs") peer_port=10051; msp="CustomsMSP" ;;
        esac
        
        print_status "Approving for ${org}..."
        
        docker exec \
            -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/users/Admin@${org}.com/msp \
            -e CORE_PEER_LOCALMSPID=$msp \
            -e CORE_PEER_TLS_ENABLED=true \
            -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt \
            -e CORE_PEER_ADDRESS=peer0.${org}.com:${peer_port} \
            cli peer lifecycle chaincode approveformyorg \
            -o orderer.coffee-consortium.com:7050 \
            --channelID $CHANNEL_NAME \
            --name $CHAINCODE_NAME \
            --version $CHAINCODE_VERSION \
            --package-id $PACKAGE_ID \
            --sequence 1 \
            --tls \
            --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem
    done
    
    print_success "Chaincode approved by all organizations"
}

# Check commit readiness
check_commit_readiness() {
    print_status "Checking commit readiness..."
    
    docker exec cli peer lifecycle chaincode checkcommitreadiness \
        --channelID $CHANNEL_NAME \
        --name $CHAINCODE_NAME \
        --version $CHAINCODE_VERSION \
        --sequence 1 \
        --tls \
        --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem \
        --output json
    
    print_success "Commit readiness checked"
}

# Commit chaincode
commit_chaincode() {
    print_status "Committing chaincode..."
    
    docker exec cli peer lifecycle chaincode commit \
        -o orderer.coffee-consortium.com:7050 \
        --channelID $CHANNEL_NAME \
        --name $CHAINCODE_NAME \
        --version $CHAINCODE_VERSION \
        --sequence 1 \
        --tls \
        --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem \
        --peerAddresses peer0.nationalbank.com:7051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt \
        --peerAddresses peer0.exporterbank.com:8051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/exporterbank.com/peers/peer0.exporterbank.com/tls/ca.crt \
        --peerAddresses peer0.coffeeauthority.com:9051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/coffeeauthority.com/peers/peer0.coffeeauthority.com/tls/ca.crt \
        --peerAddresses peer0.customs.com:10051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/customs.com/peers/peer0.customs.com/tls/ca.crt
    
    print_success "Chaincode committed successfully"
}

# Test chaincode
test_chaincode() {
    print_status "Testing chaincode deployment..."
    
    # Initialize the ledger
    docker exec cli peer chaincode invoke \
        -o orderer.coffee-consortium.com:7050 \
        --tls \
        --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem \
        -C $CHANNEL_NAME \
        -n $CHAINCODE_NAME \
        --peerAddresses peer0.nationalbank.com:7051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt \
        --peerAddresses peer0.exporterbank.com:8051 \
        --tlsRootCertFiles /etc/hyperledger/fabric/organizations/peerOrganizations/exporterbank.com/peers/peer0.exporterbank.com/tls/ca.crt \
        -c '{"function":"InitLedger","Args":[]}'
    
    sleep 5
    
    # Query all exports
    docker exec cli peer chaincode query \
        -C $CHANNEL_NAME \
        -n $CHAINCODE_NAME \
        -c '{"function":"GetAllExports","Args":[]}'
    
    print_success "Chaincode deployment test completed"
}

# Main execution
main() {
    print_status "Starting Coffee Export Chaincode Deployment"
    print_status "============================================="
    
    # Check if network is running
    if ! docker ps | grep -q "cli"; then
        print_error "Network is not running. Please start the network first."
        exit 1
    fi
    
    package_chaincode
    install_chaincode
    get_package_id
    approve_chaincode
    check_commit_readiness
    commit_chaincode
    test_chaincode
    
    print_success "🎉 Chaincode deployment completed successfully!"
    print_status "You can now use the chaincode through the API Gateway"
}

# Run main function
main "$@"