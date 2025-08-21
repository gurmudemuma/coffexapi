# Network Management Scripts

This directory contains modular scripts for managing the Hyperledger Fabric network for the Coffee Export Consortium.

## Script Organization

```
scripts/
├── channel/               # Channel management scripts
│   └── manage_channel.sh  # Create and manage channels
├── network/               # Network lifecycle scripts
│   └── start.sh           # Start the network
├── organizations/         # Organization management
│   └── generate_crypto.sh # Generate cryptographic materials
├── utils/                 # Shared utilities
│   └── common.sh          # Common functions and variables
├── cleanup.sh             # Clean up network resources
└── network_manager.sh     # Main entry point for network management
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Hyperledger Fabric binaries (`configtxgen`, `cryptogen`)
- `jq` (recommended for JSON processing)

### Using the Network Manager

The `network_manager.sh` script provides a user-friendly interface for common network operations:

```bash
# Show help
./network/scripts/network_manager.sh --help

# Generate cryptographic materials
./network/scripts/network_manager.sh generate-crypto

# Start the network
./network/scripts/network_manager.sh start

# Check network status
./network/scripts/network_manager.sh status

# Create and join a channel
./network/scripts/network_manager.sh channel create

# Clean up resources
./network/scripts/network_manager.sh clean
```

## Script Details

### `network_manager.sh`

Main entry point for network management. Provides commands for common operations:

- `start`: Start the network
- `stop`: Stop the network
- `restart`: Restart the network
- `status`: Show network status
- `clean`: Clean up network artifacts
- `generate-crypto`: Generate cryptographic materials
- `channel`: Manage channels

### `channel/manage_channel.sh`

Manages channel operations:

```bash
# Generate channel artifacts
./channel/manage_channel.sh generate

# Create and join a channel (for the first organization)
./channel/manage_channel.sh create-join coffeeexporter peer0 7051

# Join additional organizations to the channel
./channel/manage_channel.sh create-join coffeeimporter peer0 9051
```

### `organizations/generate_crypto.sh`

Generates cryptographic materials for all organizations:

```bash
# Generate crypto materials (with confirmation)
./organizations/generate_crypto.sh

# Force generation without confirmation
./organizations/generate_crypto.sh --force
```

### `network/start.sh`

Starts the network:

```bash
# Start the network
./network/start.sh

# Start and wait for network to be ready
./network/start.sh --wait
```

## Best Practices

1. Always run the cleanup script (`cleanup.sh`) before starting a fresh network
2. Generate new cryptographic materials when setting up a new network
3. Use the `--wait` flag when starting the network to ensure all containers are ready
4. Check the network status with `status` command after starting the network

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker-compose logs -f`
2. Verify cryptographic materials are generated and valid
3. Ensure no other processes are using the required ports
4. Check Docker resource allocation if containers fail to start
