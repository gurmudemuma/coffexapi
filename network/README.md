# Coffee Export Consortium Network

A complete Hyperledger Fabric consortium network for the coffee export trade finance platform.

## 🏗️ Network Architecture

### Organizations
The consortium consists of 4 peer organizations and 1 orderer organization:

1. **National Bank** (`nationalbank.com`)
   - Role: License validation and regulatory oversight
   - Peer: `peer0.nationalbank.com:7051`
   - MSP: `NationalBankMSP`

2. **Exporter Bank** (`exporterbank.com`)
   - Role: Invoice validation and payment processing
   - Peer: `peer0.exporterbank.com:8051`
   - MSP: `ExporterBankMSP`

3. **Coffee Authority** (`coffeeauthority.com`)
   - Role: Quality certification validation
   - Peer: `peer0.coffeeauthority.com:9051`
   - MSP: `CoffeeAuthorityMSP`

4. **Customs** (`customs.com`)
   - Role: Shipping document validation
   - Peer: `peer0.customs.com:10051`
   - MSP: `CustomsMSP`

5. **Orderer** (`coffee-consortium.com`)
   - Role: Transaction ordering and consensus
   - Orderer: `orderer.coffee-consortium.com:7050`
   - MSP: `OrdererMSP`

### Network Components

- **Channel**: `coffeeexport`
- **Chaincode**: `coffeeexport` (version 1.0)
- **Consensus**: Solo (single orderer)
- **Database**: CouchDB for each organization
- **TLS**: Disabled for development

## 🚀 Quick Start

### Prerequisites

1. **Docker & Docker Compose**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

2. **Hyperledger Fabric Binaries**
   ```bash
   curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0 1.5.0
   export PATH=$PATH:$PWD/bin
   ```

### Network Setup

1. **Clone and navigate to network directory**
   ```bash
   cd network
   ```

2. **Make scripts executable**
   ```bash
   chmod +x scripts/network.sh
   chmod +x scripts/deploy-chaincode.sh
   ```

3. **Start the consortium network**
   ```bash
   ./scripts/network.sh
   ```

4. **Deploy the chaincode**
   ```bash
   ./scripts/deploy-chaincode.sh
   ```

### Network Endpoints

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Orderer | `localhost:7050` | 7050 | Transaction ordering |
| National Bank | `localhost:7051` | 7051 | License validation peer |
| Exporter Bank | `localhost:8051` | 8051 | Invoice validation peer |
| Coffee Authority | `localhost:9051` | 9051 | Quality validation peer |
| Customs | `localhost:10051` | 10051 | Shipping validation peer |
| CouchDB 0 | `localhost:5984` | 5984 | National Bank database |
| CouchDB 1 | `localhost:6984` | 6984 | Exporter Bank database |
| CouchDB 2 | `localhost:7984` | 7984 | Coffee Authority database |
| CouchDB 3 | `localhost:8984` | 8984 | Customs database |

## 📁 Directory Structure

```
network/
├── ../docker-compose.yaml           # Consolidated services (network + validators)
├── configtx.yaml                    # Network configuration
├── organizations/
│   └── cryptogen/
│       ├── crypto-config.yaml       # Peer org crypto config
│       └── crypto-config-orderer.yaml # Orderer crypto config
├── scripts/
│   ├── network.sh                   # Network setup script
│   └── deploy-chaincode.sh          # Chaincode deployment script
├── organizations/                   # Generated crypto materials
├── system-genesis-block/            # Genesis block
└── channel-artifacts/               # Channel configuration
```

## 🔧 Network Operations

### Start Network
```bash
cd .. && docker-compose up -d
```

### Stop Network
```bash
cd .. && docker-compose down -v
```

### View Logs
```bash
# All services
cd .. && docker-compose logs -f

# Specific service
cd .. && docker-compose logs -f peer0.nationalbank.com
```

### Access CouchDB
```bash
# National Bank CouchDB
curl http://localhost:5984/_utils

# Exporter Bank CouchDB
curl http://localhost:6984/_utils
```

## 🔐 Security & Policies

### Channel Policies
- **Readers**: Any organization member
- **Writers**: Any organization member
- **Admins**: Majority of organizations
- **Endorsement**: Majority of organizations

### Organization Policies
Each organization has:
- **Readers**: Organization members
- **Writers**: Organization members
- **Admins**: Organization admins only
- **Endorsement**: Organization peers only

### Private Data Collections
- Export requests stored in private collections
- Visible only to exporter and bank organizations
- Validation results stored on public ledger

## 🧪 Testing the Network

### Query Chaincode
```bash
# Set environment for National Bank
export CORE_PEER_TLS_ENABLED=false
export CORE_PEER_LOCALMSPID="NationalBankMSP"
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/users/Admin@nationalbank.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/nationalbank.com/peers/peer0.nationalbank.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

# Query chaincode
docker exec peer0.nationalbank.com peer chaincode query \
    -C coffeeexport \
    -n coffeeexport \
    -c '{"Args":["QueryAllExports"]}'
```

### Invoke Chaincode
```bash
# Submit export request
docker exec peer0.nationalbank.com peer chaincode invoke \
    -o localhost:7050 \
    -C coffeeexport \
    -n coffeeexport \
    -c '{"Args":["SubmitExport","{\"exportId\":\"EXP001\",\"documentHashes\":{\"LICENSE\":\"hash1\",\"INVOICE\":\"hash2\"},\"exporter\":\"CoffeeCorp\"}"]}'
```

## 🔄 Integration with Validators

The network integrates with external validator services:

1. **National Bank Validator** → License validation
2. **Exporter Bank Validator** → Invoice validation
3. **Coffee Authority Validator** → Quality validation
4. **Customs Validator** → Shipping validation

Each validator:
- Receives validation events from blockchain
- Validates documents off-chain
- Returns results to blockchain
- Triggers payment processing on approval

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :7050
   ```

2. **Permission denied**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Chaincode deployment fails**
   ```bash
   # Check chaincode logs
   docker-compose logs peer0.nationalbank.com
   ```

4. **Network not starting**
   ```bash
   # Clean up and restart
   ./scripts/network.sh
   ```

### Log Locations
- **Orderer**: `docker logs orderer.coffee-consortium.com`
- **Peers**: `docker logs peer0.<org>.com`
- **CouchDB**: `docker logs couchdb<number>`

## 📊 Monitoring

### Health Checks
```bash
# Check all services
cd .. && docker-compose ps

# Check specific service
docker exec peer0.nationalbank.com peer node status
```

### Performance Metrics
- **TPS**: Monitor transaction throughput
- **Latency**: Check block generation time
- **Storage**: Monitor ledger growth
- **Network**: Check peer connectivity

## 🔄 Scaling

### Adding Organizations
1. Update `configtx.yaml`
2. Generate new crypto materials
3. Update channel configuration
4. Deploy to new organization

### Adding Peers
1. Update `../docker-compose.yaml`
2. Generate peer crypto materials
3. Join peer to channel
4. Install chaincode on new peer

## 📝 License

This network configuration is part of the Coffee Export Blockchain System and is licensed under the MIT License.
