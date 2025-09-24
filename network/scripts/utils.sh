#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  export CORE_PEER_LOCALMSPID="OrdererMSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem
  export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/users/Admin@coffee-consortium.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  local ORG_NAME=$1
  local ORG_DOMAIN=""
  local PEER_PORT=""

  case $ORG_NAME in
    "nationalbank")
      ORG_DOMAIN="nationalbank.com"
      PEER_PORT=7051
      ;;
    "exporterbank")
      ORG_DOMAIN="exporterbank.com"
      PEER_PORT=8051
      ;;
    "coffeeauthority")
      ORG_DOMAIN="coffeeauthority.com"
      PEER_PORT=9051
      ;;
    "customs")
      ORG_DOMAIN="customs.com"
      PEER_PORT=10051
      ;;
    *)
      echo "Unknown organization: $ORG_NAME"
      exit 1
      ;;
  esac

  export CORE_PEER_LOCALMSPID="${ORG_NAME^}MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/organizations/peerOrganizations/${ORG_DOMAIN}/peers/peer0.${ORG_DOMAIN}/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/organizations/peerOrganizations/${ORG_DOMAIN}/users/Admin@${ORG_DOMAIN}/msp
  export CORE_PEER_ADDRESS=peer0.${ORG_DOMAIN}:${PEER_PORT}
  export CORE_PEER_TLS_ENABLED=true

  if [ "$VERBOSE" = "true" ]; then
    env | grep CORE
  fi
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}
