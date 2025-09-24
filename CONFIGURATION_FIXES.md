# Coffee Export System - Configuration Fixes

This document outlines all the configuration inconsistencies that were identified and fixed in the Coffee Export Consortium system.

## 🔧 Issues Fixed

### 1. Channel Name Inconsistencies
**Problem**: Different files used different channel names (`mychannel` vs `coffeeexport`)

**Files Fixed**:
- `.env`: Changed `CHANNEL_NAME=mychannel` to `CHANNEL_NAME=coffeeexport`
- `api-gateway/config.yaml`: Changed `channelName: "mychannel"` to `channelName: "coffeeexport"`

**Impact**: Ensures all components use the same channel name for blockchain operations.

### 2. Missing Frontend Environment File
**Problem**: Frontend `.env` file was missing, preventing proper configuration

**Solution**: Created `frontend/.env` with proper settings:
```env
VITE_FEATURE_IPFS_UPLOAD=true
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
VITE_CHANNEL_NAME=coffeeexport
```

**Impact**: Enables IPFS uploads and proper API communication.

### 3. Incomplete Connection Profile
**Problem**: `api-gateway/connection.yaml` was missing organizations and had incomplete peer definitions

**Fixes**:
- Added all four organizations: NationalBank, ExporterBank, CoffeeAuthority, Customs
- Added complete peer definitions for all organizations
- Added certificate authority configurations

**Impact**: API Gateway can now connect to all peers in the consortium.

### 4. CORS Configuration Issues
**Problem**: API Gateway CORS settings didn't include all frontend ports

**Solution**: Updated `api-gateway/config.yaml` to include:
```yaml
cors:
  allowedOrigins: ["http://localhost:3001", "http://localhost:4173"]
```

**Impact**: Both development and preview frontend servers can access the API.

### 5. Docker Compose Environment Variables
**Problem**: Missing default values and dependency definitions

**Fixes**:
- Added default values for all environment variables
- Added proper service dependencies
- Fixed port mappings consistency

**Impact**: System starts reliably even without all environment variables set.

### 6. Missing System Environment Files
**Problem**: No standardized way to set environment variables across platforms

**Solution**: Created two files:
- `.env.system` (Linux/macOS): Bash script to set environment variables
- `.env.bat` (Windows): Batch script to set environment variables

**Impact**: Consistent environment setup across different operating systems.

## 📁 New Files Created

### Configuration Files
1. `frontend/.env` - Frontend environment configuration
2. `.env.system` - Linux/macOS environment setup
3. `.env.bat` - Windows environment setup

### Setup Scripts
1. `setup-system.sh` - Complete system setup script
2. `network/scripts/deploy-chaincode.sh` - Chaincode deployment script
3. `validate-config.sh` - Configuration validation script

### Documentation
1. `CONFIGURATION_FIXES.md` - This file documenting all fixes

## 🚀 Usage Instructions

### Quick Start
```bash
# 1. Validate configuration
./validate-config.sh

# 2. Set up environment (Linux/macOS)
source .env.system

# 3. Set up the entire system
./setup-system.sh

# 4. Deploy chaincode
./network/scripts/deploy-chaincode.sh

# 5. Start frontend
cd frontend && npm run dev
```

### Windows Quick Start
```cmd
REM 1. Set up environment
.env.bat

REM 2. Set up the system
bash setup-system.sh

REM 3. Deploy chaincode
bash network/scripts/deploy-chaincode.sh

REM 4. Start frontend
cd frontend && npm run dev
```

## 🔍 Configuration Validation

Run the configuration validator to check for issues:
```bash
./validate-config.sh
```

This script checks:
- Environment file consistency
- API Gateway configuration
- Connection profile completeness
- Network configuration
- Docker Compose setup
- Chaincode presence
- Script executability
- Port conflicts

## 📊 System Architecture

The fixed system now has consistent configuration across all components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Blockchain    │
│   Port: 3001    │◄──►│   Port: 8000    │◄──►│   Network       │
│   Channel: ✓    │    │   Channel: ✓    │    │   Channel: ✓    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IPFS          │    │   Validators    │    │   CouchDB       │
│   Port: 5001    │    │   Ports: 8081-3 │    │   Ports: 15984+ │
└─────────────────┘    └───���─────────────┘    └─────────────────┘
```

## 🔧 Environment Variables

All environment variables are now consistently defined:

| Variable | Value | Purpose |
|----------|-------|---------|
| `CHANNEL_NAME` | `coffeeexport` | Blockchain channel name |
| `CHAINCODE_NAME` | `coffee_export` | Smart contract name |
| `API_GATEWAY_PORT` | `8000` | API Gateway port |
| `CLIENT_ORGANIZATION` | `NationalBank` | Default client org |
| `CLIENT_MSP` | `NationalBankMSP` | Default MSP ID |

## 🐛 Common Issues Resolved

### Issue: "Channel not found"
**Cause**: Channel name mismatch between components
**Fix**: All components now use `coffeeexport` channel

### Issue: "CORS error in frontend"
**Cause**: Missing CORS origins in API Gateway
**Fix**: Added all frontend ports to CORS configuration

### Issue: "Cannot connect to peer"
**Cause**: Incomplete connection profile
**Fix**: Added all organizations and peers to connection profile

### Issue: "Environment variables not set"
**Cause**: Missing environment setup
**Fix**: Created platform-specific environment setup scripts

## 📝 Maintenance

### Regular Checks
1. Run `./validate-config.sh` before starting the system
2. Check Docker container status: `docker-compose ps`
3. Monitor logs: `docker-compose logs -f [service-name]`

### Updates
When updating the system:
1. Stop all services: `docker-compose down`
2. Update configuration files as needed
3. Validate: `./validate-config.sh`
4. Restart: `./setup-system.sh`

## 🎯 Next Steps

With all configurations fixed, the system is ready for:
1. Production deployment
2. Additional chaincode development
3. Frontend feature enhancements
4. Integration with external systems

The configuration is now consistent, validated, and documented for reliable operation of the Coffee Export Consortium system.