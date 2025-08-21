#!/bin/bash

# Script to manage Hyperledger Fabric channels

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Channel configuration
CHANNEL_NAME=${CHANNEL_NAME:-"coffeeexportchannel"}
CONFIG_DIR="$SCRIPT_DIR/../channel-artifacts"
ORGS_DIR="$SCRIPT_DIR/../organizations"

# Function to generate channel artifacts
generate_channel_artifacts() {
    print_status "Generating channel artifacts..."
    
    # Create directory if it doesn't exist
    mkdir -p "$CONFIG_DIR"
    
    # Generate genesis block
    if ! configtxgen -configPath "$SCRIPT_DIR/.." -profile CoffeeExportOrdererGenesis -channelID system-channel -outputBlock "$CONFIG_DIR/genesis.block"; then
        print_error "Failed to generate orderer genesis block"
        exit 1
    fi
    
    # Generate channel configuration transaction
    if ! configtxgen -configPath "$SCRIPT_DIR/.." -profile CoffeeExportChannel -outputCreateChannelTx "$CONFIG_DIR/$CHANNEL_NAME.tx" -channelID "$CHANNEL_NAME"; then
        print_error "Failed to generate channel configuration transaction"
        exit 1
    fi
    
    # Generate anchor peer transactions
    for org in coffeeexporter coffeeimporter logistics; do
        if ! configtxgen -configPath "$SCRIPT_DIR/.." -profile CoffeeExportChannel -outputAnchorPeersUpdate "$CONFIG_DIR/${org}MSPanchors.tx" -channelID "$CHANNEL_NAME" -asOrg "${org^}MSP"; then
            print_error "Failed to generate anchor peer update for $org"
            exit 1
        fi
    done
    
    print_success "Channel artifacts generated successfully in $CONFIG_DIR"
}

# Function to create and join channel
create_and_join_channel() {
    local org="$1"
    local peer="$2"
    local port="$3"
    local mspid="${org^}MSP"
    
    print_status "Creating and joining channel for $org..."
    
    # Set environment variables
    export CORE_PEER_MSPCONFIGPATH="$ORGS_DIR/peerOrganizations/$org.example.com/users/Admin@$org.example.com/msp"
    export CORE_PEER_ADDRESS="$peer.$org.example.com:$port"
    export CORE_PEER_LOCALMSPID="$mspid"
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_TLS_ROOTCERT_FILE="$ORGS_DIR/peerOrganizations/$org.example.com/peers/$peer.$org.example.com/tls/ca.crt"
    
    # Create channel
    if ! peer channel create -o orderer.coffeeexport.com:7050 -c "$CHANNEL_NAME" -f "$CONFIG_DIR/$CHANNEL_NAME.tx" --tls --cafile "$ORGS_DIR/ordererOrganizations/coffeeexport.com/orderers/orderer.coffeeexport.com/msp/tlscacerts/tlsca.coffeeexport.com-cert.pem"; then
        print_error "Failed to create channel"
        exit 1
    fi
    
    # Join channel
    if ! peer channel join -b "$CHANNEL_NAME.block"; then
        print_error "Failed to join channel"
        exit 1
    fi
    
    # Update anchor peers
    if ! peer channel update -o orderer.coffeeexport.com:7050 -c "$CHANNEL_NAME" -f "$CONFIG_DIR/${org}MSPanchors.tx" --tls --cafile "$ORGS_DIR/ordererOrganizations/coffeeexport.com/orderers/orderer.coffeeexport.com/msp/tlscacerts/tlsca.coffeeexport.com-cert.pem"; then
        print_warning "Failed to update anchor peers for $org"
    fi
    
    print_success "$org successfully joined channel $CHANNEL_NAME"
}

# Main execution
case "$1" in
    generate)
        generate_channel_artifacts
        ;;
    create-join)
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo "Usage: $0 create-join <org> <peer> <port>"
            exit 1
        fi
        create_and_join_channel "$2" "$3" "$4"
        ;;
    *)
        echo "Usage: $0 {generate|create-join}"
        echo "  generate      - Generate channel artifacts"
        echo "  create-join   - Create and join channel (requires org, peer, and port arguments)"
        exit 1
        ;;
esac
