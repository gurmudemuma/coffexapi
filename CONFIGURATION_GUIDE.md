# Coffee Export System - Configuration Guide

## Overview
This document provides comprehensive information about the corrected configuration for the Coffee Export System (Coffexapi), a decentralized trade finance platform built on Hyperledger Fabric blockchain technology.

## Fixed Configuration Issues

### 1. ✅ Removed Incorrect Configuration File
- **Issue**: `configtx.reconstructed.yaml` contained incorrect example.com domains
- **Fix**: Removed the file - the correct configuration is in `network/configtx.yaml`

### 2. ✅ Created Missing Frontend Environment File
- **Issue**: Frontend `.env` file was missing, preventing IPFS and API configuration
- **Fix**: Created `frontend/.env` with proper settings:
  - IPFS uploads enabled (`VITE_FEATURE_IPFS_UPLOAD=true`)
  - API Gateway URL set to `http://localhost:8000`
  - Development environment configured

### 3. ✅ Fixed Docker Compose Validator Services
- **Issue**: Validator services had incorrect environment variable names and missing configuration
- **Fix**: 
  - Standardized environment variables to use `VALID_HASHES`
  - Added default hash values for testing
  - Added proper `PORT` configuration for each validator

### 4. ✅ Added Missing CouchDB Configuration
- **Issue**: National Bank peer was missing CouchDB configuration
- **Fix**: Added CouchDB state database configuration to National Bank peer

### 5. ✅ Created Environment Configuration Files
- **Issue**: No standardized way to set validator test hashes
- **Fix**: Created `.env.system` and `.env.bat` files with proper test data

### 6. ✅ Fixed Network Configuration
- **Issue**: Hard-coded IP addresses in CLI extra_hosts causing networking issues
- **Fix**: Removed hard-coded IPs to rely on Docker's automatic service discovery

## System Architecture

### Port Mappings
- **Orderer**: 7050
- **National Bank Peer**: 7051-7052, 9443
- **Exporter Bank Peer**: 8051-8052, 9444
- **Coffee Authority Peer**: 9051-9052, 9445
- **Customs Peer**: 10051-10052, 9446
- **CouchDB Instances**: 15984-15987
- **IPFS**: 5001 (API), 8080 (Gateway)
- **API Gateway**: 8000
- **Validators**:
  - National Bank: 8080
  - Bank API: 5000
  - Quality Authority: 8081
  - Customs: 8082

### Network Topology
```
coffee_net (Blockchain Network)
├── orderer.coffee-consortium.com
├── peer0.nationalbank.com + couchdb.nationalbank.com
├── peer0.exporterbank.com + couchdb.exporterbank.com
├── peer0.coffeeauthority.com + couchdb.coffeeauthority.com
├── peer0.customs.com + couchdb.customs.com
├── cli
├── ipfs
└── api-gateway

validator_net (Validation Network)
├── validator-base
├── national-bank-validator
├── bank-api-validator
├── quality-authority-validator
├── customs-validator
├── ipfs
└── api-gateway
```

## Quick Start Guide

### Prerequisites
1. **Docker & Docker Compose**: Latest versions installed and running
2. **Node.js**: Version 16+ for frontend development
3. **Go**: Version 1.18+ for chaincode development (if modifying)
4. **Git**: For version control

### Windows Setup (Recommended)
```cmd
# 1. Navigate to project directory
cd c:\coffexapi

# 2. Set environment variables
.env.bat

# 3. Start the entire system
docker-compose up --build

# 4. Verify services are running
docker ps
```

### Linux/Mac Setup
```bash
# 1. Navigate to project directory
cd /path/to/coffexapi

# 2. Load environment variables
source .env.system

# 3. Start the entire system
docker-compose up --build

# 4. Verify services are running
docker ps
```

### Alternative: Network Manager Scripts
```bash
# Full network setup (recommended for development)
./network/scripts/network_manager.sh generate-crypto
./network/scripts/network_manager.sh start
./network/scripts/network_manager.sh channel create
./network/scripts/network_manager.sh status
```

## Service Verification

### 1. Check Blockchain Network
```bash
# Check orderer health
curl http://localhost:7050/health

# Check peer health (if exposed)
docker logs peer0.nationalbank.com
```

### 2. Verify Validators
```bash
# Test National Bank validator
curl "http://localhost:8080/validate?hash=a1b2c3d4e5f6789012345"

# Test Bank API validator  
curl "http://localhost:5000/validate?hash=x9y8z7w6v5u4t3s2r1q0"

# Test Quality Authority validator
curl "http://localhost:8081/validate?hash=q1w2e3r4t5y6u7i8o9p0"

# Test Customs validator
curl "http://localhost:8082/validate?hash=s1h2i3p4p5i6n7g8d9o0"
```

### 3. Check IPFS Service
```bash
# Check IPFS daemon
curl http://localhost:5001/api/v0/id

# Check IPFS gateway
curl http://localhost:8080/ipfs/QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o
```

### 4. Verify API Gateway
```bash
# Check API Gateway health
curl http://localhost:8000/health
```

## Configuration Files Reference

### Key Configuration Files
1. **`docker-compose.yaml`** - Main orchestration file
2. **`network/configtx.yaml`** - Fabric network configuration
3. **`frontend/.env`** - Frontend environment settings
4. **`.env.system`** - System environment variables
5. **`.env.bat`** - Windows environment setup

### Environment Variables
```bash
# Validator test hashes
TEST_LICENSE_HASH="a1b2c3d4e5f6789012345,e5f6g7h8901234567890ab"
TEST_INVOICE_HASH="x9y8z7w6v5u4t3s2r1q0,w6v5u4t3s2r1q0p9o8n7"  
TEST_QUALITY_HASH="q1w2e3r4t5y6u7i8o9p0,t5y6u7i8o9p0a1s2d3f4"
TEST_SHIPPING_HASH="s1h2i3p4p5i6n7g8d9o0,p5i6n7g8d9o0c1u2m3e4"

# Network configuration
CHANNEL_NAME="coffee-channel"
CHAINCODE_NAME="coffee-export" 
CHAINCODE_VERSION="1.0"
```

## Troubleshooting

### Common Issues

#### 1. Container Startup Failures
```bash
# Check container logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up --build [service-name]
```

#### 2. Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep :7050
# Windows: netstat -an | findstr :7050

# Kill process using port (Linux/Mac)
sudo lsof -ti:7050 | xargs kill -9
```

#### 3. Network Issues
```bash
# Reset Docker networks
docker network prune

# Recreate containers
docker-compose down
docker-compose up --build
```

#### 4. Cryptographic Material Issues
```bash
# Regenerate crypto materials
./network/scripts/network_manager.sh generate-crypto

# Clean and restart
docker-compose down -v
docker-compose up --build
```

### Diagnostic Commands
```bash
# Check all container status
docker ps -a

# View container resource usage
docker stats

# Check Docker networks
docker network ls

# Inspect specific network
docker network inspect coffexapi_coffee_net

# Check volumes
docker volume ls
```

## Development Workflow

### 1. Making Changes
```bash
# Stop services
docker-compose down

# Make your changes to configuration or code

# Rebuild and restart
docker-compose up --build
```

### 2. Adding New Organizations
1. Update `network/configtx.yaml` with new organization
2. Generate new cryptographic materials
3. Update `docker-compose.yaml` with new peer services
4. Restart the network

### 3. Modifying Validators
1. Update validator code in `validators/` directory
2. Modify environment variables in `.env.system`
3. Rebuild validator containers
```bash
docker-compose build validator-base
docker-compose up --build [validator-name]
```

## Security Considerations

### TLS Configuration
- All Fabric components use TLS encryption
- Certificates are automatically generated
- Private keys are protected in Docker volumes

### Access Control
- MSP (Membership Service Provider) based identity management
- Organization-specific permissions
- Private data collections for sensitive information

### Network Isolation
- Separate Docker networks for security isolation
- API Gateway mediates between networks
- Validator services isolated from blockchain network

## Next Steps

1. **Start the system** using the quick start guide above
2. **Verify all services** are running using the verification steps
3. **Access the frontend** at http://localhost:3000 (when implemented)
4. **Test document validation** using the API endpoints
5. **Monitor logs** for any issues and refer to troubleshooting section

For additional help, refer to the project README.md files in each component directory.