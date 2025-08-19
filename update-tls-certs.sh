#!/bin/bash

# Get the orderer's CA certificate
ORDERER_CA_CERT=$(docker exec orderer.coffee-consortium.com cat /var/hyperledger/orderer/tls/ca.crt)

# Update CA certificate for all peers
for org in nationalbank exporterbank coffeeauthority customs; do
    echo "Updating TLS CA certificate for peer0.${org}.com..."
    
    # Create a temporary file with the orderer's CA certificate
    echo "$ORDERER_CA_CERT" > /tmp/orderer-ca.crt
    
    # Copy the orderer's CA certificate to the peer's container
    docker cp /tmp/orderer-ca.crt peer0.${org}.com:/etc/hyperledger/fabric/tls/orderer-ca.crt
    
    # Combine the existing CA cert with the orderer's CA cert
    docker exec peer0.${org}.com bash -c 'cat /etc/hyperledger/fabric/tls/ca.crt /etc/hyperledger/fabric/tls/orderer-ca.crt > /etc/hyperledger/fabric/tls/combined-ca.crt && \
    cp /etc/hyperledger/fabric/tls/combined-ca.crt /etc/hyperledger/fabric/tls/ca.crt'
    
    echo "TLS CA certificate updated for peer0.${org}.com"
done

# Clean up
echo "Cleaning up temporary files..."
rm -f /tmp/orderer-ca.crt

echo "TLS CA certificates have been updated for all peers."
