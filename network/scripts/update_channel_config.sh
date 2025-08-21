#!/bin/bash

# Define the base directory
BASE_DIR="/home/gu-da/coffexapi/network"
BIN_DIR="/home/gu-da/coffexapi/bin"

echo "Generating updated channel configuration..."

# Set FABRIC_CFG_PATH to the network directory
export FABRIC_CFG_PATH=$BASE_DIR

# Create a new channel configuration
$BIN_DIR/configtxgen -profile CoffeeExportChannel -outputCreateChannelTx $BASE_DIR/channel-artifacts/coffeeexport_updated.tx -channelID coffeeexport

# Sign the channel configuration with National Bank admin
$BIN_DIR/peer channel signconfigtx -f $BASE_DIR/channel-artifacts/coffeeexport_updated.tx -o orderer.coffee-consortium.com:7050 --tls --cafile $BASE_DIR/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem

echo "Updated channel configuration generated at $BASE_DIR/channel-artifacts/coffeeexport_updated.tx"
