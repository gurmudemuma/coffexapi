#!/bin/bash
ORG=
export CORE_PEER_LOCALMSPID="
MSP"
export CORE_PEER_TLS_ROOTCERT_FILE="/home/gu-da/coffexapi/organizations/peerOrganizations/
.com/peers/peer0.
.com/tls/ca.crt"
export CORE_PEER_MSPCONFIGPATH="/home/gu-da/coffexapi/organizations/peerOrganizations/
.com/users/Admin@
.com/msp"
case  in
    "nationalbank") export CORE_PEER_ADDRESS=localhost:7051 ;;     "exporterbank") export CORE_PEER_ADDRESS=localhost:8051 ;;     "coffeeauthority") export CORE_PEER_ADDRESS=localhost:9051 ;;     "customs") export CORE_PEER_ADDRESS=localhost:10051 ;; esac
