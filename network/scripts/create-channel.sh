#!/bin/bash

CHANNEL_NAME=${1:-"coffeeexport"}
DELAY=${2:-"3"}
MAX_RETRY=${3:-"5"}
VERBOSE=${4:-"false"}

: ${CHANNEL_NAME:="coffeeexport"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

# import utils
. /opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/utils.sh

createChannel() {
	set -x
	peer channel create -o orderer.coffee-consortium.com:7050 -c $CHANNEL_NAME -f /etc/hyperledger/fabric/channel-artifacts/channel.tx --outputBlock /etc/hyperledger/fabric/channel-artifacts/${CHANNEL_NAME}.block --tls --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem >&log.txt
	res=$?
	set +x
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel '$CHANNEL_NAME' created ===================== "
	echo
}

joinChannel () {
	for org in nationalbank exporterbank coffeeauthority customs; do
	    setGlobals $org
	    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block >&log.txt
	    res=$?
	    cat log.txt
	    if [ $res -ne 0 -a $COUNTER -lt $MAX_RETRY ]; then
		COUNTER=` expr $COUNTER + 1`
		echo "peer0.${org} failed to join the channel, Retry after $DELAY seconds"
		sleep $DELAY
		joinChannel
	    else
		COUNTER=1
	    fi
	    verifyResult $res "After $MAX_RETRY attempts, peer0.${org} has failed to join channel '$CHANNEL_NAME' "
	done
}

updateAnchorPeers() {
    for org in nationalbank exporterbank coffeeauthority customs; do
        setGlobals $org
        peer channel update -o orderer.coffee-consortium.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile /etc/hyperledger/fabric/organizations/ordererOrganizations/coffee-consortium.com/orderers/orderer.coffee-consortium.com/msp/tlscacerts/tlsca.coffee-consortium.com-cert.pem >&log.txt
        res=$?
        cat log.txt
        verifyResult $res "Anchor peer update failed"
        echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '$CHANNEL_NAME' ===================== "
        sleep $DELAY
        echo
    done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for each org..."
updateAnchorPeers

echo
echo "========= Channel setup successful =========== "
echo

exit 0