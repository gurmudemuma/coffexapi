# Coffee Export Blockchain System

A decentralized trade finance platform for coffee exports using Hyperledger Fabric blockchain technology.

## 🏗️ Architecture Overview

The system has been refactored to eliminate code duplication and improve maintainability through shared components:

### Shared Components

#### 1. **Shared Validation Library** (`chaincode/shared/`)
- **`validator.go`**: Common validation logic and HTTP handlers
- **`config.go`**: Centralized configuration for all validator types
- **`blockchain.go`**: Shared blockchain utilities for common operations

#### 2. **Base Docker Image** (`validators/Dockerfile.base`)
- Standardized containerization for all validators
- Includes health checks and security best practices

#### 3. **Validator Services**
All validators now use the shared library, reducing code duplication by ~80%:

- **National Bank** (`validators/national-bank/`): License validation
- **Bank API** (`chaincode/bank-api/`): Invoice validation  
- **Quality Authority** (`validators/quality-authority/`): Quality certificate validation
- **Customs** (`validators/customs/`): Shipping document validation

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.18+
- Node.js 16+

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.18+
- Node.js 16+
- Hyperledger Fabric binaries (`configtxgen`, `cryptogen`)
- `jq` (recommended for JSON processing)

### Running the System

#### Option 1: Using Docker Compose (Quick Start)
```bash
docker-compose up --build
```

#### Option 2: Using the Network Manager (Recommended for Development)

1. **Generate cryptographic materials:**
```bash
./network/scripts/network_manager.sh generate-crypto
```

2. **Start the network:**
```bash
./network/scripts/network_manager.sh start
```

3. **Create and join a channel:**
```bash
./network/scripts/network_manager.sh channel create
```

4. **Check network status:**
```bash
./network/scripts/network_manager.sh status
```

### Access the services:
- National Bank Validator: http://localhost:8080
- Bank API Validator: http://localhost:5000
- Quality Authority: http://localhost:8081
- Customs Validator: http://localhost:8082

### Environment Configuration

Each validator can be configured via environment variables:

```yaml
# Example validator configuration
environment:
  - VALIDATOR_TYPE=LICENSE
  - VALID_LICENSES=a1b2c3d4,e5f6g7h8
  - PORT=8080
```

## 📁 Project Structure

```
coffexapi/
├── chaincode/
│   ├── shared/                 # Shared libraries
│   │   ├── validator.go        # Common validation logic
│   │   ├── config.go           # Centralized configuration
│   │   └── blockchain.go       # Blockchain utilities
│   ├── go/                     # Smart contracts
│   │   ├── coffee_export.go    # Main export logic
│   │   └── payment.go          # Payment processing
│   └── bank-api/               # Bank validator (Go)
├── validators/
│   ├── Dockerfile.base         # Base Docker image
│   ├── national-bank/          # License validator
│   ├── quality-authority/      # Quality validator
│   └── customs/                # Customs validator
├── services/
│   └── bank-coordinator/       # Payment coordination
├── frontend/                   # React frontend
└── docker-compose.yaml         # Consolidated services (network + validators)
```

## 🔧 Adding New Validators

The shared architecture makes it easy to add new validators:

1. **Create validator directory:**
```bash
mkdir validators/new-validator
```

2. **Create main.go using shared library:**
```go
package main

import (
    "log"
    "os"
    "../shared"
)

func main() {
    config := shared.GetConfigForType(shared.ValidatorType("NEW_TYPE"))
    validator := shared.NewValidatorService(config)
    
    if err := validator.StartServer(); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
```

3. **Create Dockerfile:**
```dockerfile
FROM validator-base:latest
ENV VALIDATOR_TYPE=NEW_TYPE
ENV VALID_DOCS=hash1,hash2
EXPOSE 8083
```

4. **Add to docker-compose.yaml (consolidated):**
```yaml
new-validator:
  build:
    context: .
    dockerfile: validators/new-validator/Dockerfile
  ports:
    - "8083:8083"
  environment:
    - VALIDATOR_TYPE=NEW_TYPE
    - VALID_DOCS=hash1,hash2
```

## 🔄 Workflow

1. **Export Submission**: Frontend uploads documents → Smart contract stores request
2. **Parallel Validation**: Multiple validators check documents simultaneously
3. **Result Recording**: Validation results stored on blockchain
4. **Payment Processing**: Approved exports trigger SWIFT payments

## 🛡️ Security Features

- **Private Data Collections**: Export requests visible only to authorized parties
- **MSP-based Authorization**: Validators must have appropriate identities
- **Document Hashing**: SHA256 validation prevents tampering
- **Multi-party Validation**: Different organizations validate different documents

## 📊 Benefits of Refactoring

- **80% reduction** in validator code duplication
- **Standardized** validation logic across all services
- **Easy scaling** - adding new validators takes minutes
- **Centralized configuration** management
- **Improved maintainability** through shared components
- **Consistent** error handling and response formats

## 🧪 Testing

Test individual validators:
```bash
# Test license validation
curl "http://localhost:8080/validate?hash=a1b2c3d4"

# Test invoice validation  
curl "http://localhost:5000/validate?hash=x9y8z7"
```

## 🤝 Contributing

1. Follow the shared library pattern for new validators
2. Use the base Docker image for consistency
3. Add configuration to `shared/config.go`
4. Update `docker-compose.yaml` for new services (consolidated)

## 📝 License

This project is licensed under the MIT License.
