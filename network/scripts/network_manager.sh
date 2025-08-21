#!/bin/bash

# Coffee Export Network Manager
# A user-friendly interface for managing the Hyperledger Fabric network

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils/common.sh"

# Display usage information
show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Available commands:"
    echo "  start           Start the network"
    echo "  stop            Stop the network"
    echo "  restart         Restart the network"
    echo "  status          Show network status"
    echo "  clean           Clean up network artifacts"
    echo "  generate-crypto Generate cryptographic materials"
    echo "  channel         Manage channels"
    echo "  help            Show this help message"
    echo ""
    echo "Run '$0 [command] --help' for more information about a command."
}

# Handle channel subcommands
handle_channel() {
    case "$1" in
        create)
            "$SCRIPT_DIR/channel/manage_channel.sh" generate
            "$SCRIPT_DIR/channel/manage_channel.sh" create-join coffeeexporter peer0 7051
            ;;
        join)
            if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
                echo "Usage: $0 channel join <org> <peer> <port>"
                exit 1
            fi
            "$SCRIPT_DIR/channel/manage_channel.sh" create-join "$2" "$3" "$4"
            ;;
        *)
            echo "Usage: $0 channel {create|join}"
            echo "  create        - Create a new channel and join as the first organization"
            echo "  join <org> <peer> <port> - Join an organization to the channel"
            exit 1
            ;;
    esac
}

# Main execution
case "$1" in
    start)
        "$SCRIPT_DIR/network/start.sh" "${@:2}"
        ;;
    stop)
        docker-compose -f "$SCRIPT_DIR/../../docker-compose.yaml" down
        ;;
    restart)
        "$0" stop
        sleep 2
        "$0" start "${@:2}"
        ;;
    status)
        docker ps --filter "name=fabric"
        ;;
    clean)
        "$SCRIPT_DIR/cleanup.sh" "${@:2}"
        ;;
    generate-crypto)
        "$SCRIPT_DIR/organizations/generate_crypto.sh" "${@:2}"
        ;;
    channel)
        handle_channel "${@:2}"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        exit 1
        ;;
esac

exit 0
