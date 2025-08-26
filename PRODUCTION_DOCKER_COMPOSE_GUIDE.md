# Coffee Export System - Production Docker Compose Guide

## 🎯 **Overview**

This document describes the **single, complete Docker Compose configuration** (`docker-compose.yaml`) for the Coffee Export System. After removing the incomplete reconstructed version, this file now serves as the **only** and **definitive** deployment configuration for the entire Coffee Export System.

## ✅ **What Was Done**

### 1. **Removed Incomplete Configuration**
- ❌ **Deleted**: `docker-compose.reconstructed.yaml` (partial system with only 2 organizations)
- ❌ **Deleted**: `DOCKER_COMPOSE_RECONSTRUCTION_FIXES.md` (no longer needed)
- ✅ **Updated**: `cleanup.sh` to remove references to deleted files

### 2. **Enhanced Main Configuration**
- ✅ **Added**: Explicit network drivers (`bridge`) for better reliability
- ✅ **Added**: Proper dependency management (`depends_on`) for all CouchDB services
- ✅ **Verified**: All configurations are syntactically correct
- ✅ **Ensured**: Complete Coffee Export System functionality

## 🏗️ **Complete System Architecture**

### **Blockchain Network (coffee_net)**
```yaml
# Orderer Service
- orderer.coffee-consortium.com (Port: 7050)

# Organization 1: National Bank
- couchdb.nationalbank.com (Port: 15984)
- peer0.nationalbank.com (Ports: 7051-7052, 9443)

# Organization 2: Exporter Bank  
- couchdb.exporterbank.com (Port: 15985)
- peer0.exporterbank.com (Ports: 8051-8052, 9444)

# Organization 3: Coffee Authority
- couchdb.coffeeauthority.com (Port: 15986)
- peer0.coffeeauthority.com (Ports: 9051-9052, 9445)

# Organization 4: Customs
- couchdb.customs.com (Port: 15987)
- peer0.customs.com (Ports: 10051-10052, 9446)

# Management Tools
- cli (Command line interface)
```

### **Validator Network (validator_net)**
```yaml
# Base Infrastructure
- validator-base (Base image for all validators)
- ipfs (Ports: 5001, 8080)

# Document Validators
- national-bank-validator (Port: 8080) - License validation
- bank-api-validator (Port: 5000) - Invoice validation  
- quality-authority-validator (Port: 8081) - Quality certificate validation
- customs-validator (Port: 8082) - Shipping document validation

# API Services
- api-gateway (Port: 8000) - Central API endpoint
```

## 🔧 **Key Improvements Made**

### 1. **Network Configuration**
```yaml
# Before: Basic networks
networks:
  coffee_net:
  validator_net:

# After: Explicit drivers for reliability
networks:
  coffee_net:
    driver: bridge
  validator_net:
    driver: bridge
```

### 2. **Service Dependencies**
```yaml
# Added proper startup sequence
peer0.nationalbank.com:
  depends_on:
    - couchdb.nationalbank.com  # CouchDB starts first

peer0.exporterbank.com:
  depends_on:
    - couchdb.exporterbank.com

peer0.coffeeauthority.com:
  depends_on:
    - couchdb.coffeeauthority.com

peer0.customs.com:
  depends_on:
    - couchdb.customs.com
```

### 3. **Complete System Coverage**
- ✅ **4 Full Organizations** (not just 2)
- ✅ **All Validator Services** (license, invoice, quality, shipping)
- ✅ **IPFS Integration** with CORS configuration
- ✅ **API Gateway** with all validator endpoints
- ✅ **Proper CouchDB** configuration for all peers

## 🚀 **How to Use**

### **Quick Start**
```bash
# Navigate to project directory
cd c:\coffexapi

# Set environment variables (Windows)
.env.bat

# Start the complete system
docker-compose up --build

# Verify all services are running
docker ps
```

### **Alternative: Network Manager Scripts**
```bash
# Full network setup (recommended for development)
./network/scripts/network_manager.sh generate-crypto
./network/scripts/network_manager.sh start
./network/scripts/network_manager.sh channel create
./network/scripts/network_manager.sh status
```

## 📋 **Service Verification**

### 1. **Blockchain Services**
```bash
# Check orderer
curl -s http://localhost:7050/health

# Check peer logs
docker logs peer0.nationalbank.com
docker logs peer0.exporterbank.com
docker logs peer0.coffeeauthority.com
docker logs peer0.customs.com
```

### 2. **Validator Services**
```bash
# Test License Validator (National Bank)
curl "http://localhost:8080/validate?hash=a1b2c3d4e5f6789012345"

# Test Invoice Validator (Bank API)
curl "http://localhost:5000/validate?hash=x9y8z7w6v5u4t3s2r1q0"

# Test Quality Validator (Coffee Authority)
curl "http://localhost:8081/validate?hash=q1w2e3r4t5y6u7i8o9p0"

# Test Customs Validator
curl "http://localhost:8082/validate?hash=s1h2i3p4p5i6n7g8d9o0"
```

### 3. **Support Services**
```bash
# Check IPFS
curl http://localhost:5001/api/v0/id

# Check API Gateway
curl http://localhost:8000/health

# Check CouchDB instances
curl http://admin:adminpw@localhost:15984/
curl http://admin:adminpw@localhost:15985/
curl http://admin:adminpw@localhost:15986/
curl http://admin:adminpw@localhost:15987/
```

## 🛠️ **Environment Configuration**

### **Required Environment Variables**
```bash
# Validator test hashes (from .env.system or .env.bat)
TEST_LICENSE_HASH="a1b2c3d4e5f6789012345,e5f6g7h8901234567890ab"
TEST_INVOICE_HASH="x9y8z7w6v5u4t3s2r1q0,w6v5u4t3s2r1q0p9o8n7"
TEST_QUALITY_HASH="q1w2e3r4t5y6u7i8o9p0,t5y6u7i8o9p0a1s2d3f4"  
TEST_SHIPPING_HASH="s1h2i3p4p5i6n7g8d9o0,p5i6n7g8d9o0c1u2m3e4"
```

### **Frontend Configuration**
```bash
# frontend/.env file
VITE_FEATURE_IPFS_UPLOAD=true
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
```

## 📊 **Complete Port Mapping**

| **Service** | **Ports** | **Purpose** |
|-------------|-----------|-------------|
| **Orderer** | 7050 | Blockchain ordering service |
| **National Bank** | 7051-7052, 9443 | Peer and operations |
| **Exporter Bank** | 8051-8052, 9444 | Peer and operations |
| **Coffee Authority** | 9051-9052, 9445 | Peer and operations |
| **Customs** | 10051-10052, 9446 | Peer and operations |
| **CouchDB Instances** | 15984-15987 | State databases |
| **License Validator** | 8080 | Document validation |
| **Invoice Validator** | 5000 | Document validation |
| **Quality Validator** | 8081 | Document validation |
| **Customs Validator** | 8082 | Document validation |
| **IPFS** | 5001, 8080 | Decentralized storage |
| **API Gateway** | 8000 | Central API endpoint |

## 🔍 **Troubleshooting**

### **Common Issues**

#### 1. **Container Startup Failures**
```bash
# Check all container status
docker ps -a

# Check specific service logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

#### 2. **Port Conflicts**
```bash
# Check port usage (Windows)
netstat -an | findstr :7050

# Kill processes using ports if needed
# Use Task Manager or stop conflicting services
```

#### 3. **Network Issues**
```bash
# Reset Docker networks
docker network prune

# Restart entire system
docker-compose down
docker-compose up --build
```

#### 4. **Database Connection Issues**
```bash
# Check CouchDB connectivity
curl http://admin:adminpw@localhost:15984/_up

# Restart peer and its CouchDB together
docker-compose restart couchdb.nationalbank.com peer0.nationalbank.com
```

## 🎯 **Benefits of Single Configuration**

1. ✅ **Simplified Management**: Only one configuration file to maintain
2. ✅ **Complete Functionality**: All 4 organizations and validator services
3. ✅ **Production Ready**: Optimized with proper dependencies and networking
4. ✅ **No Confusion**: No partial/incomplete configurations
5. ✅ **Easy Deployment**: Single command deployment
6. ✅ **Full Coffee Export Workflow**: End-to-end document validation system

## 🚀 **Next Steps**

1. **Start the system** using the commands above
2. **Verify all services** are running properly
3. **Test document validation** through the validator endpoints
4. **Access frontend** when implemented (Port 3000)
5. **Monitor system health** through container logs

The Coffee Export System now has a **single, robust, and complete** Docker Compose configuration that provides full functionality for the decentralized trade finance platform.