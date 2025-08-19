#!/bin/bash

# Coffee Export Consortium - Complete System Setup
# This script sets up the entire coffee export blockchain system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
    echo "  Coffee Export Consortium System Setup"
    echo "================================================"
    echo -e "${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking system prerequisites..."
    
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
    
    # Check Hyperledger Fabric binaries
    if ! command -v cryptogen &> /dev/null; then
        print_warning "Hyperledger Fabric binaries not found."
        print_status "Please ensure you have Hyperledger Fabric binaries in your PATH."
        print_status "You can add them to your PATH or install them manually."
        print_status "Continuing with existing network setup..."
    fi
    
    print_success "All prerequisites are satisfied"
}

# Setup consortium network
setup_network() {
    print_status "Setting up consortium network..."
    
    cd network
    
    if [ ! -f "scripts/network.sh" ]; then
        print_error "Network setup script not found"
        exit 1
    fi
    
    ./scripts/network.sh
    
    cd ..
    print_success "Consortium network setup completed"
}

# Deploy chaincode
deploy_chaincode() {
    print_status "Deploying smart contracts..."
    
    cd network
    
    if [ ! -f "scripts/deploy-chaincode.sh" ]; then
        print_error "Chaincode deployment script not found"
        exit 1
    fi
    
    ./scripts/deploy-chaincode.sh
    
    cd ..
    print_success "Smart contracts deployed successfully"
}

# Setup validator services
setup_validators() {
    print_status "Setting up validator services..."
    
    # Build and start validators
    docker-compose up -d validator-base nb-api bank-api quality-api customs-api
    
    # Wait for validators to be ready
    print_status "Waiting for validators to be ready..."
    sleep 10
    
    # Test validators
    test_validators
    
    print_success "Validator services setup completed"
}

# Test validators
test_validators() {
    print_status "Testing validator services..."
    
    # Test National Bank validator
    if curl -s "http://localhost:8080/validate?hash=a1b2c3d4" > /dev/null; then
        print_success "National Bank validator is responding"
    else
        print_warning "National Bank validator not responding"
    fi
    
    # Test Bank API validator
    if curl -s "http://localhost:5000/validate?hash=x9y8z7" > /dev/null; then
        print_success "Bank API validator is responding"
    else
        print_warning "Bank API validator not responding"
    fi
    
    # Test Quality Authority validator
    if curl -s "http://localhost:8081/validate?hash=q1w2e3r4" > /dev/null; then
        print_success "Quality Authority validator is responding"
    else
        print_warning "Quality Authority validator not responding"
    fi
    
    # Test Customs validator
    if curl -s "http://localhost:8082/validate?hash=s1h2i3p4" > /dev/null; then
        print_success "Customs validator is responding"
    else
        print_warning "Customs validator not responding"
    fi
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend application..."
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    print_status "Starting frontend development server..."
    npm run dev &
    FRONTEND_PID=$!
    
    cd ..
    
    # Wait for frontend to be ready
    sleep 5
    
    # Test frontend
    if curl -s "http://localhost:3000" > /dev/null; then
        print_success "Frontend is running on http://localhost:3000"
    else
        print_warning "Frontend may not be ready yet"
    fi
    
    print_success "Frontend setup completed"
}

# Display system status
show_status() {
    print_status "System Status:"
    echo ""
    echo "🌐 Consortium Network:"
    echo "  - Orderer: localhost:7050"
    echo "  - National Bank Peer: localhost:7051"
    echo "  - Exporter Bank Peer: localhost:8051"
    echo "  - Coffee Authority Peer: localhost:9051"
    echo "  - Customs Peer: localhost:10051"
    echo ""
    echo "🔍 Validator Services:"
    echo "  - National Bank: http://localhost:8080"
    echo "  - Bank API: http://localhost:5000"
    echo "  - Quality Authority: http://localhost:8081"
    echo "  - Customs: http://localhost:8082"
    echo ""
    echo "💾 Databases:"
    echo "  - CouchDB 0: http://localhost:5984"
    echo "  - CouchDB 1: http://localhost:6984"
    echo "  - CouchDB 2: http://localhost:7984"
    echo "  - CouchDB 3: http://localhost:8984"
    echo ""
    echo "🎨 Frontend:"
    echo "  - Web Interface: http://localhost:3000"
    echo ""
    echo "📋 Channel: coffeeexport"
    echo "📦 Chaincode: coffeeexport@1.0"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    # Stop frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Stop all services
    docker-compose down -v 2>/dev/null || true
    
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
    
    # Setup network
    setup_network
    
    # Deploy chaincode
    deploy_chaincode
    
    # Setup validators
    setup_validators
    
    # Setup frontend
    setup_frontend
    
    # Show final status
    echo ""
    print_success "🎉 Coffee Export Consortium System is ready!"
    echo ""
    show_status
    echo ""
    print_status "You can now:"
    echo "  1. Access the frontend at http://localhost:3000"
    echo "  2. Submit export requests through the web interface"
    echo "  3. Monitor the blockchain network"
    echo "  4. View validation results in CouchDB"
    echo ""
    print_status "Press Ctrl+C to stop all services"
    
    # Keep the script running
    wait
}

# Run main function
main "$@"
