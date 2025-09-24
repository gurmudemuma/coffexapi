#!/bin/bash

# Coffee Export System - Channel Issue Fix Script
# This script diagnoses and fixes channel creation issues

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
    echo "  Coffee Export System - Channel Issue Fix"
    echo "========================================================"
    echo -e "${NC}"
}

# Check network status
check_network_status() {
    print_status "Checking network status..."
    
    # Check if containers are running
    if ! docker ps | grep -q "orderer.coffee-consortium.com"; then
        print_error "Orderer container is not running"
        return 1
    fi
    
    if ! docker ps | grep -q "peer0.nationalbank.com"; then
        print_error "National Bank peer is not running"
        return 1
    fi
    
    if ! docker ps | grep -q "cli"; then
        print_error "CLI container is not running"
        return 1
    fi
    
    print_success "All required containers are running"
}

# Clean up existing channel artifacts
cleanup_channel_artifacts() {
    print_status "Cleaning up existing channel artifacts..."
    
    # Remove existing channel block
    docker exec cli rm -f /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block 2>/dev/null || true
    
    # Clean up any existing channel data
    docker-compose restart peer0.nationalbank.com peer0.exporterbank.com peer0.coffeeauthority.com peer0.customs.com
    
    sleep 10
    
    print_success "Channel artifacts cleaned up"
}

# Use simple configuration
use_simple_config() {
    print_status "Switching to simple configuration..."
    
    # Backup original config
    cp network/configtx.yaml network/configtx.yaml.backup 2>/dev/null || true
    
    # Use simple config
    if [ -f "network/configtx-simple.yaml" ]; then
        cp network/configtx-simple.yaml network/configtx.yaml
        print_success "Switched to simple configuration"
    else
        print_error "Simple configuration file not found"
        return 1
    fi
}

# Regenerate network artifacts with simple config
regenerate_artifacts() {
    print_status "Regenerating network artifacts with simple configuration..."
    
    export FABRIC_CFG_PATH=$PWD/network
    
    # Regenerate genesis block
    ./bin/configtxgen -profile CoffeeConsortiumOrdererGenesis -channelID system-channel -outputBlock network/system-genesis-block/genesis.block
    
    # Regenerate channel transaction
    ./bin/configtxgen -profile CoffeeExportChannel -outputCreateChannelTx network/channel-artifacts/channel.tx -channelID coffeeexport
    
    # Regenerate anchor peer transactions
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/NationalBankMSPanchors.tx -channelID coffeeexport -asOrg NationalBankMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/ExporterBankMSPanchors.tx -channelID coffeeexport -asOrg ExporterBankMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/CoffeeAuthorityMSPanchors.tx -channelID coffeeexport -asOrg CoffeeAuthorityMSP
    ./bin/configtxgen -profile CoffeeExportChannel -outputAnchorPeersUpdate network/channel-artifacts/CustomsMSPanchors.tx -channelID coffeeexport -asOrg CustomsMSP
    
    print_success "Network artifacts regenerated"
}

# Restart orderer with new genesis block
restart_orderer() {
    print_status "Restarting orderer with new genesis block..."
    
    docker-compose stop orderer.coffee-consortium.com
    sleep 5
    docker-compose start orderer.coffee-consortium.com
    sleep 10
    
    print_success "Orderer restarted"
}

# Create channel with simplified approach
create_channel_simple() {
    print_status "Creating channel with simplified approach..."
    
    # Set environment for National Bank
    export CORE_PEER_LOCALMSPID="NationalBankMSP"
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
    export CORE_PEER_ADDRESS=peer0.nationalbank.com:7051
    
    # Create channel with simplified command
    docker exec \
        -e CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID \
        -e CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED \
        -e CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE \
        -e CORE_PEER_MSPCONFIGPATH=$CORE_PEER_MSPCONFIGPATH \
        -e CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS \
        cli peer channel create \
        -o orderer.coffee-consortium.com:7050 \
        -c coffeeexport \
        -f /etc/hyperledger/fabric/channel-artifacts/channel.tx \
        --outputBlock /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block \
        --tls \
        --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem
    
    if [ $? -eq 0 ]; then
        print_success "Channel created successfully"
    else
        print_error "Channel creation failed"
        return 1
    fi
}

# Join peers to channel
join_peers() {
    print_status "Joining peers to channel..."
    
    local orgs=("nationalbank" "exporterbank" "coffeeauthority" "customs")
    local msps=("NationalBankMSP" "ExporterBankMSP" "CoffeeAuthorityMSP" "CustomsMSP")
    local ports=(7051 8051 9051 10051)
    
    for i in "${!orgs[@]}"; do
        local org=${orgs[$i]}
        local msp=${msps[$i]}
        local port=${ports[$i]}
        
        print_status "Joining $org peer to channel..."
        
        docker exec \
            -e CORE_PEER_LOCALMSPID=$msp \
            -e CORE_PEER_TLS_ENABLED=true \
            -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/peers/peer0.${org}.com/tls/ca.crt \
            -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${org}.com/users/Admin@${org}.com/msp \
            -e CORE_PEER_ADDRESS=peer0.${org}.com:${port} \
            cli peer channel join \
            -b /etc/hyperledger/fabric/channel-artifacts/coffeeexport.block
        
        if [ $? -eq 0 ]; then
            print_success "$org peer joined successfully"
        else
            print_warning "$org peer join failed (may already be joined)"
        fi
    done
}

# Verify channel creation
verify_channel() {
    print_status "Verifying channel creation..."
    
    # List channels
    docker exec \
        -e CORE_PEER_LOCALMSPID=NationalBankMSP \
        -e CORE_PEER_TLS_ENABLED=true \
        -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt \
        -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp \
        -e CORE_PEER_ADDRESS=peer0.nationalbank.com:7051 \
        cli peer channel list
    
    print_success "Channel verification completed"
}

# Show troubleshooting information
show_troubleshooting_info() {
    print_status "Troubleshooting Information:"
    echo ""
    echo "If the channel creation still fails, try these steps:"
    echo ""
    echo "1. Check orderer logs:"
    echo "   docker-compose logs orderer.coffee-consortium.com"
    echo ""
    echo "2. Check peer logs:"
    echo "   docker-compose logs peer0.nationalbank.com"
    echo ""
    echo "3. Verify crypto materials exist:"
    echo "   docker exec cli ls -la /etc/hyperledger/fabric/organizations/"
    echo ""
    echo "4. Check channel transaction file:"
    echo "   docker exec cli ls -la /etc/hyperledger/fabric/channel-artifacts/"
    echo ""
    echo "5. Manual channel creation (if needed):"
    echo "   docker exec -it cli bash"
    echo "   export CORE_PEER_LOCALMSPID=NationalBankMSP"
    echo "   export CORE_PEER_TLS_ENABLED=true"
    echo "   export CORE_PEER_ADDRESS=peer0.nationalbank.com:7051"
    echo "   peer channel create -o orderer.coffee-consortium.com:7050 -c coffeeexport -f /etc/hyperledger/fabric/channel-artifacts/channel.tx --tls --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem"
}

# Main execution
main() {
    print_header
    
    print_status "Attempting to fix channel creation issue..."
    
    # Check if binaries exist
    if [ ! -f "./bin/configtxgen" ]; then
        print_error "Fabric binaries not found. Please run setup-system.sh first."
        exit 1
    fi
    
    check_network_status || exit 1
    cleanup_channel_artifacts
    use_simple_config
    regenerate_artifacts
    restart_orderer
    
    print_status "Attempting channel creation..."
    if create_channel_simple; then
        join_peers
        verify_channel
        print_success "🎉 Channel issue fixed successfully!"
        echo ""
        print_status "You can now proceed with chaincode deployment:"
        echo "./network/scripts/deploy-chaincode.sh"
    else
        print_error "Channel creation still failed"
        show_troubleshooting_info
        exit 1
    fi
}

# Run main function
main "$@"