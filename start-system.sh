#!/bin/bash

# Coffee Export System - Simplified Startup
# Works with existing codebase, minimal downloads

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

print_header() {
    echo -e "${BLUE}"
    echo "================================================"
    echo "  Coffee Export System - Quick Start"
    echo "================================================"
    echo -e "${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    print_success "Basic prerequisites are satisfied"
}

# Download Fabric tools if needed
download_fabric_tools() {
    # Check if tools exist in current directory
    if [ -f "./cryptogen" ] && [ -f "./configtxgen" ]; then
        print_success "Found Fabric tools in current directory"
        # Make sure they're executable
        chmod +x ./cryptogen ./configtxgen
        # Add current directory to PATH
        export PATH=$PWD:$PATH
        return 0
    # Check if tools are in system PATH
    elif command -v cryptogen &> /dev/null && command -v configtxgen &> /dev/null; then
        print_success "Fabric tools already available in system PATH"
        return 0
    else
        print_warning "Hyperledger Fabric tools not found in current directory or PATH."
        print_status "Attempting to download minimal Fabric CLI tools..."

        if [ -f "download-fabric-tools.sh" ]; then
            ./download-fabric-tools.sh
            # Verify download was successful
            if [ -f "./cryptogen" ] && [ -f "./configtxgen" ]; then
                chmod +x ./cryptogen ./configtxgen
                export PATH=$PWD:$PATH
                print_success "Successfully downloaded Fabric tools"
                return 0
            else
                print_error "Failed to download Fabric tools"
                exit 1
            fi
        else
            print_error "download-fabric-tools.sh not found. Please install Fabric tools manually."
            exit 1
        fi
    fi
}

# Setup network (if needed)
setup_network() {
    print_status "Setting up consortium network..."

    if [ -d "network" ] && [ -f "network/scripts/network.sh" ]; then
        cd network
        ./scripts/network.sh
        cd ..
        print_success "Network setup completed"
    else
        print_warning "Network setup scripts not found. Skipping network setup."
        print_status "You can set up the network manually later."
    fi
}

# Wait for a service to be ready
wait_for_service() {
    local service_name=$1
    local service_url=$2
    local max_retries=30
    local retry_interval=2

    print_status "Waiting for ${service_name} to be ready at ${service_url}..."

    for ((i=0; i<max_retries; i++)); do
        if curl -s --insecure ${service_url} > /dev/null 2>&1; then
            print_success "${service_name} is ready"
            return 0
        fi
        sleep ${retry_interval}
    done

    print_error "Failed to connect to ${service_name} after ${max_retries} retries."
    exit 1
}

# Start validator services
start_validators() {
    print_status "Starting validator services..."

    # Start only validator services
    docker-compose up -d validator-base nb-api bank-api quality-api customs-api

    # Wait for validators to be ready
    wait_for_service "National Bank validator" "https://localhost:8080/validate?hash=${TEST_LICENSE_HASH}"
    wait_for_service "Bank API validator" "https://localhost:5000/validate?hash=${TEST_INVOICE_HASH}"
    wait_for_service "Quality Authority validator" "https://localhost:8081/validate?hash=${TEST_QUALITY_HASH}"
    wait_for_service "Customs validator" "https://localhost:8082/validate?hash=${TEST_SHIPPING_HASH}"

    print_success "Validator services started"
}

# Test validators
test_validators() {
    print_status "Testing validator services..."

    # Test National Bank validator
    if curl -s --insecure "https://localhost:8080/validate?hash=${TEST_LICENSE_HASH}" > /dev/null 2>&1; then
        print_success "National Bank validator is responding"
    else
        print_warning "National Bank validator not responding"
    fi

    # Test Bank API validator
    if curl -s --insecure "https://localhost:5000/validate?hash=${TEST_INVOICE_HASH}" > /dev/null 2>&1; then
        print_success "Bank API validator is responding"
    else
        print_warning "Bank API validator not responding"
    fi

    # Test Quality Authority validator
    if curl -s --insecure "https://localhost:8081/validate?hash=${TEST_QUALITY_HASH}" > /dev/null 2>&1; then
        print_success "Quality Authority validator is responding"
    else
        print_warning "Quality Authority validator not responding"
    fi

    # Test Customs validator
    if curl -s --insecure "https://localhost:8082/validate?hash=${TEST_SHIPPING_HASH}" > /dev/null 2>&1; then
        print_success "Customs validator is responding"
    else
        print_warning "Customs validator not responding"
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend application..."

    cd frontend

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi

    # Build frontend
    print_status "Building frontend..."
    npm run build

    # Start frontend in background
    print_status "Starting frontend preview server..."
    npm run preview &
    FRONTEND_PID=$!

    cd ..

    # Wait for frontend to be ready
    wait_for_service "Frontend" "http://localhost:4173"

    print_success "Frontend setup completed"
}

# Display system status
show_status() {
    print_status "System Status:"
    echo ""
    echo "🔍 Validator Services:"
    echo "  - National Bank: https://localhost:8080"
    echo "  - Bank API: https://localhost:5000"
    echo "  - Quality Authority: https://localhost:8081"
    echo "  - Customs: https://localhost:8082"
    echo ""
    echo "🎨 Frontend:"
    echo "  - Web Interface: http://localhost:4173"
    echo ""
    echo "💾 Databases (if network is running):"
    echo "  - CouchDB 0: http://localhost:5984"
    echo "  - CouchDB 1: http://localhost:6984"
    echo "  - CouchDB 2: http://localhost:7984"
    echo "  - CouchDB 3: http://localhost:8984"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."

    # Stop frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    print_success "Cleanup completed"
}

# Main execution
main() {
    print_header

    # Set up signal handlers
    trap cleanup EXIT
    trap 'print_error "Setup interrupted"; exit 1' INT TERM

    # Check prerequisites
    check_prerequisites

    # Download Fabric tools if needed
    download_fabric_tools

    # Add Fabric tools to PATH
    export PATH=$PATH:$PWD
    
    # Set test hashes
    export TEST_LICENSE_HASH="a1b2c3d4"
    export TEST_INVOICE_HASH="x9y8z7"
    export TEST_QUALITY_HASH="q1w2e3r4"
    export TEST_SHIPPING_HASH="s1h2i3p4"

    # Setup network (optional)
    setup_network

    # Start validators
    start_validators

    # Setup frontend
    setup_frontend

    # Show final status
    echo ""
    print_success "🎉 Coffee Export System is ready!"
    echo ""
    show_status
    echo ""
    print_status "You can now:"
    echo "  1. Access the frontend at http://localhost:4173"
    echo "  2. Submit export requests through the web interface"
    echo "  3. Test validator services"
    echo ""
    print_status "Press Ctrl+C to stop all services"

    # Keep the script running
    wait
}

# Run main function
main "$@"