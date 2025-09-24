#!/bin/bash

# Coffee Export System Configuration Validator
# Validates all configuration files for consistency

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

ERRORS=0
WARNINGS=0

# Function to increment error count
add_error() {
    print_error "$1"
    ((ERRORS++))
}

# Function to increment warning count
add_warning() {
    print_warning "$1"
    ((WARNINGS++))
}

print_header() {
    echo -e "${BLUE}"
    echo "========================================================"
    echo "  Coffee Export System Configuration Validator"
    echo "========================================================"
    echo -e "${NC}"
}

# Validate environment files
validate_env_files() {
    print_status "Validating environment files..."
    
    # Check main .env file
    if [ ! -f ".env" ]; then
        add_error "Main .env file is missing"
    else
        # Check for required variables
        required_vars=("CHANNEL_NAME" "CHAINCODE_NAME" "API_GATEWAY_PORT" "CLIENT_ORGANIZATION" "CLIENT_MSP")
        for var in "${required_vars[@]}"; do
            if ! grep -q "^${var}=" .env; then
                add_error "Missing required variable $var in .env"
            fi
        done
        
        # Check channel name consistency
        channel_name=$(grep "^CHANNEL_NAME=" .env | cut -d'=' -f2)
        if [ "$channel_name" != "coffeeexport" ]; then
            add_error "Channel name in .env should be 'coffeeexport', found '$channel_name'"
        fi
    fi
    
    # Check frontend .env file
    if [ ! -f "frontend/.env" ]; then
        add_error "Frontend .env file is missing"
    else
        if ! grep -q "VITE_FEATURE_IPFS_UPLOAD=true" frontend/.env; then
            add_warning "IPFS uploads may be disabled in frontend/.env"
        fi
        
        if ! grep -q "VITE_API_BASE_URL=http://localhost:8000" frontend/.env; then
            add_warning "API base URL may be incorrect in frontend/.env"
        fi
    fi
    
    # Check system environment files
    if [ ! -f ".env.system" ]; then
        add_warning "System environment file .env.system is missing"
    fi
    
    if [ ! -f ".env.bat" ]; then
        add_warning "Windows environment file .env.bat is missing"
    fi
}

# Validate API Gateway configuration
validate_api_gateway() {
    print_status "Validating API Gateway configuration..."
    
    if [ ! -f "api-gateway/config.yaml" ]; then
        add_error "API Gateway config.yaml is missing"
        return
    fi
    
    # Check channel name
    if ! grep -q 'channelName: "coffeeexport"' api-gateway/config.yaml; then
        add_error "API Gateway config.yaml has incorrect channel name"
    fi
    
    # Check chaincode name
    if ! grep -q 'chaincodeName: "coffee_export"' api-gateway/config.yaml; then
        add_error "API Gateway config.yaml has incorrect chaincode name"
    fi
    
    # Check CORS origins
    if ! grep -q "http://localhost:3001" api-gateway/config.yaml; then
        add_warning "API Gateway may not allow frontend access (missing localhost:3001 in CORS)"
    fi
    
    if ! grep -q "http://localhost:4173" api-gateway/config.yaml; then
        add_warning "API Gateway may not allow preview frontend access (missing localhost:4173 in CORS)"
    fi
}

# Validate connection profile
validate_connection_profile() {
    print_status "Validating connection profile..."
    
    if [ ! -f "api-gateway/connection.yaml" ]; then
        add_error "API Gateway connection.yaml is missing"
        return
    fi
    
    # Check if all organizations are defined
    orgs=("NationalBank" "ExporterBank" "CoffeeAuthority" "Customs")
    for org in "${orgs[@]}"; do
        if ! grep -q "^  ${org}:" api-gateway/connection.yaml; then
            add_error "Organization $org is missing from connection.yaml"
        fi
    done
    
    # Check if all peers are defined
    peers=("peer0.nationalbank.com" "peer0.exporterbank.com" "peer0.coffeeauthority.com" "peer0.customs.com")
    for peer in "${peers[@]}"; do
        if ! grep -q "^  ${peer}:" api-gateway/connection.yaml; then
            add_error "Peer $peer is missing from connection.yaml"
        fi
    done
    
    # Check orderer
    if ! grep -q "orderer.coffee-consortium.com:" api-gateway/connection.yaml; then
        add_error "Orderer is missing from connection.yaml"
    fi
}

# Validate network configuration
validate_network_config() {
    print_status "Validating network configuration..."
    
    if [ ! -f "network/configtx.yaml" ]; then
        add_error "Network configtx.yaml is missing"
        return
    fi
    
    # Check organizations in configtx.yaml
    orgs=("NationalBank" "ExporterBank" "CoffeeAuthority" "Customs")
    for org in "${orgs[@]}"; do
        if ! grep -q "Name: ${org}MSP" network/configtx.yaml; then
            add_error "Organization ${org}MSP is missing from configtx.yaml"
        fi
    done
    
    # Check profiles
    if ! grep -q "CoffeeConsortiumOrdererGenesis:" network/configtx.yaml; then
        add_error "CoffeeConsortiumOrdererGenesis profile is missing from configtx.yaml"
    fi
    
    if ! grep -q "CoffeeExportChannel:" network/configtx.yaml; then
        add_error "CoffeeExportChannel profile is missing from configtx.yaml"
    fi
}

# Validate Docker Compose configuration
validate_docker_compose() {
    print_status "Validating Docker Compose configuration..."
    
    if [ ! -f "docker-compose.yaml" ]; then
        add_error "docker-compose.yaml is missing"
        return
    fi
    
    # Check if all required services are defined
    services=("orderer.coffee-consortium.com" "peer0.nationalbank.com" "peer0.exporterbank.com" "peer0.coffeeauthority.com" "peer0.customs.com" "api-gateway" "ipfs")
    for service in "${services[@]}"; do
        if ! grep -q "^  ${service}:" docker-compose.yaml; then
            add_error "Service $service is missing from docker-compose.yaml"
        fi
    done
    
    # Check validator services
    validators=("national-bank-validator" "bank-api-validator" "quality-authority-validator" "customs-validator")
    for validator in "${validators[@]}"; do
        if ! grep -q "^  ${validator}:" docker-compose.yaml; then
            add_error "Validator service $validator is missing from docker-compose.yaml"
        fi
    done
    
    # Check networks
    if ! grep -q "coffee_net:" docker-compose.yaml; then
        add_error "coffee_net network is missing from docker-compose.yaml"
    fi
    
    if ! grep -q "validator_net:" docker-compose.yaml; then
        add_error "validator_net network is missing from docker-compose.yaml"
    fi
}

# Validate chaincode
validate_chaincode() {
    print_status "Validating chaincode..."
    
    if [ ! -f "chaincode/go/coffee_export.go" ]; then
        add_error "Main chaincode file coffee_export.go is missing"
    fi
    
    if [ ! -f "chaincode/go/go.mod" ]; then
        add_error "Chaincode go.mod is missing"
    fi
    
    # Check if chaincode has required functions
    if [ -f "chaincode/go/coffee_export.go" ]; then
        required_functions=("InitLedger" "CreateExport" "GetExport" "GetAllExports" "UpdateExportStatus")
        for func in "${required_functions[@]}"; do
            if ! grep -q "func.*${func}" chaincode/go/coffee_export.go; then
                add_warning "Chaincode function $func may be missing"
            fi
        done
    fi
}

# Validate scripts
validate_scripts() {
    print_status "Validating scripts..."
    
    scripts=("setup-system.sh" "start-system.sh" "network/scripts/network.sh" "network/scripts/deploy-chaincode.sh")
    for script in "${scripts[@]}"; do
        if [ ! -f "$script" ]; then
            add_error "Script $script is missing"
        elif [ ! -x "$script" ]; then
            add_warning "Script $script is not executable"
        fi
    done
}

# Validate frontend configuration
validate_frontend() {
    print_status "Validating frontend configuration..."
    
    if [ ! -f "frontend/package.json" ]; then
        add_error "Frontend package.json is missing"
    fi
    
    if [ ! -f "frontend/vite.config.ts" ]; then
        add_error "Frontend vite.config.ts is missing"
    fi
    
    if [ ! -f "frontend/tsconfig.json" ]; then
        add_error "Frontend tsconfig.json is missing"
    fi
    
    # Check if .env.example exists
    if [ ! -f "frontend/.env.example" ]; then
        add_warning "Frontend .env.example is missing"
    fi
}

# Check port conflicts
validate_ports() {
    print_status "Validating port configurations..."
    
    # Extract ports from docker-compose.yaml
    if [ -f "docker-compose.yaml" ]; then
        # Check for common port conflicts
        ports=(7050 7051 8051 9051 10051 8000 5001 8090 15984 15985 15986 15987)
        for port in "${ports[@]}"; do
            if netstat -tuln 2>/dev/null | grep -q ":${port} "; then
                add_warning "Port $port is already in use"
            fi
        done
    fi
}

# Generate summary report
generate_summary() {
    echo ""
    echo -e "${BLUE}========================================================"
    echo "  Configuration Validation Summary"
    echo -e "========================================================${NC}"
    echo ""
    
    if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        print_success "🎉 All configurations are valid!"
        echo ""
        echo "Your Coffee Export System is properly configured and ready to run."
        echo ""
        echo "Next steps:"
        echo "1. Run: ./setup-system.sh"
        echo "2. Deploy chaincode: ./network/scripts/deploy-chaincode.sh"
        echo "3. Start frontend: cd frontend && npm run dev"
    else
        echo -e "${RED}❌ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
        echo ""
        
        if [ $ERRORS -gt 0 ]; then
            echo -e "${RED}Critical issues that must be fixed:${NC}"
            echo "- Configuration files are missing or have incorrect values"
            echo "- The system may not start properly with these errors"
            echo ""
        fi
        
        if [ $WARNINGS -gt 0 ]; then
            echo -e "${YELLOW}Warnings (recommended to fix):${NC}"
            echo "- Some optional configurations are missing"
            echo "- The system should work but may have limited functionality"
            echo ""
        fi
        
        echo "Please review the issues above and run this validator again."
    fi
    
    echo ""
    echo "Configuration files checked:"
    echo "- .env (main environment)"
    echo "- frontend/.env (frontend environment)"
    echo "- api-gateway/config.yaml (API Gateway)"
    echo "- api-gateway/connection.yaml (Fabric connection)"
    echo "- network/configtx.yaml (network configuration)"
    echo "- docker-compose.yaml (container orchestration)"
    echo "- chaincode files"
    echo "- setup scripts"
}

# Main execution
main() {
    print_header
    
    validate_env_files
    validate_api_gateway
    validate_connection_profile
    validate_network_config
    validate_docker_compose
    validate_chaincode
    validate_scripts
    validate_frontend
    validate_ports
    
    generate_summary
    
    # Exit with error code if there are critical errors
    if [ $ERRORS -gt 0 ]; then
        exit 1
    fi
}

# Run main function
main "$@"