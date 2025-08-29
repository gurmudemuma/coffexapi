#!/bin/bash

# Coffee Export Platform - Unified Deployment Orchestration
# Comprehensive deployment automation for all environments

set -e

# Script metadata
SCRIPT_VERSION="2.0.0"
SCRIPT_NAME="Coffee Export Platform Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default configuration
DEFAULT_ENVIRONMENT="development"
DEFAULT_MODE="full"
DEFAULT_TIMEOUT="300"

# Configuration variables
ENVIRONMENT="${DEPLOY_ENV:-$DEFAULT_ENVIRONMENT}"
MODE="${DEPLOY_MODE:-$DEFAULT_MODE}"
TIMEOUT="${DEPLOY_TIMEOUT:-$DEFAULT_TIMEOUT}"
SKIP_TESTS="${SKIP_TESTS:-false}"
SKIP_HEALTH_CHECKS="${SKIP_HEALTH_CHECKS:-false}"
VERBOSE="${VERBOSE:-false}"
DRY_RUN="${DRY_RUN:-false}"

# Paths and directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="$PROJECT_ROOT/config"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
LOGS_DIR="$PROJECT_ROOT/logs"

# Log file
DEPLOYMENT_LOG="$LOGS_DIR/deployment-$(date +%Y%m%d-%H%M%S).log"

# Create logs directory if it doesn't exist
mkdir -p "$LOGS_DIR"

# Logging functions
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$DEPLOYMENT_LOG"
    
    # Log to console with colors
    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "DEBUG")
            if [[ "$VERBOSE" == "true" ]]; then
                echo -e "${PURPLE}[DEBUG]${NC} $message"
            fi
            ;;
    esac
}

# Print usage information
print_usage() {
    cat << EOF
$SCRIPT_NAME v$SCRIPT_VERSION

USAGE:
    $0 [OPTIONS] [COMMAND]

COMMANDS:
    full            Full deployment (default)
    blockchain      Deploy only blockchain network
    services        Deploy only validator services
    frontend        Deploy only frontend application
    monitoring      Deploy only monitoring stack
    cleanup         Clean up all resources
    status          Show deployment status
    logs            Show deployment logs
    test            Run deployment tests

OPTIONS:
    -e, --environment ENV     Target environment (development|staging|production)
    -m, --mode MODE          Deployment mode (full|blockchain|services|frontend|monitoring)
    -t, --timeout SECONDS    Deployment timeout in seconds (default: 300)
    --skip-tests             Skip deployment tests
    --skip-health-checks     Skip health checks
    --dry-run                Show what would be deployed without executing
    --verbose                Enable verbose logging
    -h, --help               Show this help message

ENVIRONMENT VARIABLES:
    DEPLOY_ENV               Deployment environment
    DEPLOY_MODE              Deployment mode
    DEPLOY_TIMEOUT           Deployment timeout
    SKIP_TESTS               Skip tests (true|false)
    SKIP_HEALTH_CHECKS       Skip health checks (true|false)
    VERBOSE                  Enable verbose mode (true|false)
    DRY_RUN                  Enable dry run mode (true|false)

EXAMPLES:
    # Full deployment to development environment
    $0

    # Deploy to production environment
    $0 --environment production

    # Deploy only blockchain network
    $0 --mode blockchain

    # Dry run deployment
    $0 --dry-run --verbose

    # Clean up all resources
    $0 cleanup

    # Check deployment status
    $0 status

ENVIRONMENTS:
    development     Local development with hot reload
    staging         Staging environment for testing
    production      Production environment with optimizations

For more information, see: README.md
EOF
}

# Print header
print_header() {
    echo -e "${CYAN}"
    echo "=================================================================="
    echo "  $SCRIPT_NAME v$SCRIPT_VERSION"
    echo "=================================================================="
    echo -e "${NC}"
    echo "Environment: $ENVIRONMENT"
    echo "Mode: $MODE"
    echo "Timeout: ${TIMEOUT}s"
    echo "Log file: $DEPLOYMENT_LOG"
    echo
}

# Cleanup function for exit
cleanup_on_exit() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log "ERROR" "Deployment failed with exit code: $exit_code"
        log "INFO" "Deployment log saved to: $DEPLOYMENT_LOG"
        echo
        echo -e "${RED}Deployment failed! Check the log file for details:${NC}"
        echo -e "${YELLOW}$DEPLOYMENT_LOG${NC}"
    fi
    exit $exit_code
}

# Set up trap for cleanup
trap cleanup_on_exit EXIT

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites for $ENVIRONMENT environment..."
    
    local missing_tools=()
    
    # Required tools
    local required_tools=("docker" "docker-compose" "node" "npm")
    
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    # Environment-specific checks
    case $ENVIRONMENT in
        "production")
            # Additional production checks
            if ! command -v helm &> /dev/null; then
                log "WARNING" "Helm not found - required for production Kubernetes deployment"
            fi
            if ! command -v kubectl &> /dev/null; then
                log "WARNING" "kubectl not found - required for production Kubernetes deployment"
            fi
            ;;
        "staging")
            # Staging-specific checks
            if ! docker info &> /dev/null; then
                log "ERROR" "Docker daemon not running"
                exit 1
            fi
            ;;
    esac
    
    if [[ ${#missing_tools[@]} -ne 0 ]]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        log "INFO" "Please install the missing tools and try again"
        exit 1
    fi
    
    log "SUCCESS" "All prerequisites satisfied"
}

# Load environment configuration
load_environment_config() {
    log "INFO" "Loading configuration for $ENVIRONMENT environment..."
    
    # Load environment-specific configuration
    local env_config="$CONFIG_DIR/environments/$ENVIRONMENT.env"
    
    if [[ -f "$env_config" ]]; then
        set -a  # Automatically export variables
        source "$env_config"
        set +a
        log "SUCCESS" "Loaded environment configuration: $env_config"
    else
        log "WARNING" "Environment configuration not found: $env_config"
        log "INFO" "Using default configuration"
    fi
    
    # Validate required environment variables
    local required_vars=()
    
    case $ENVIRONMENT in
        "production")
            required_vars=("DATABASE_URL" "BLOCKCHAIN_NETWORK" "MONITORING_ENDPOINT")
            ;;
        "staging")
            required_vars=("DATABASE_URL" "BLOCKCHAIN_NETWORK")
            ;;
    esac
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log "ERROR" "Required environment variable not set: $var"
            exit 1
        fi
    done
}

# Build services
build_services() {
    log "INFO" "Building services for $ENVIRONMENT environment..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would build all services"
        return 0
    fi
    
    # Build base images first
    log "INFO" "Building base validator image..."
    docker build -f validators/Dockerfile.base -t validator-base:latest . \
        || { log "ERROR" "Failed to build validator base image"; exit 1; }
    
    # Build individual services
    local services=(
        "national-bank-validator:validators/national-bank/Dockerfile"
        "quality-authority-validator:validators/quality-authority/Dockerfile"
        "customs-validator:validators/customs/Dockerfile"
        "bank-api-validator:validators/bank-api/Dockerfile"
        "api-gateway:api-gateway/Dockerfile"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name dockerfile <<< "$service_info"
        log "INFO" "Building $service_name..."
        
        docker build -f "$dockerfile" -t "$service_name:latest" . \
            || { log "ERROR" "Failed to build $service_name"; exit 1; }
    done
    
    # Build frontend for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log "INFO" "Building production frontend..."
        cd "$PROJECT_ROOT/frontend"
        npm ci --production
        npm run build
        cd "$PROJECT_ROOT"
    fi
    
    log "SUCCESS" "All services built successfully"
}

# Deploy blockchain network
deploy_blockchain() {
    log "INFO" "Deploying blockchain network..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would deploy blockchain network"
        return 0
    fi
    
    # Generate crypto materials if needed
    if [[ ! -d "$PROJECT_ROOT/network/organizations" ]]; then
        log "INFO" "Generating crypto materials..."
        cd "$PROJECT_ROOT"
        ./network/scripts/organizations/generate_crypto.sh \
            || { log "ERROR" "Failed to generate crypto materials"; exit 1; }
    fi
    
    # Start blockchain network
    log "INFO" "Starting blockchain network components..."
    docker-compose -f docker-compose.yaml up -d \
        orderer.coffee-consortium.com \
        peer0.nationalbank.com \
        peer0.exporterbank.com \
        peer0.coffeeauthority.com \
        peer0.customs.com \
        couchdb.nationalbank.com \
        couchdb.exporterbank.com \
        couchdb.coffeeauthority.com \
        couchdb.customs.com \
        cli \
        ipfs \
        || { log "ERROR" "Failed to start blockchain network"; exit 1; }
    
    # Wait for network to be ready
    log "INFO" "Waiting for blockchain network to be ready..."
    sleep 30
    
    # Deploy chaincode
    log "INFO" "Deploying chaincode..."
    if [[ -f "$PROJECT_ROOT/network/scripts/deploy-chaincode.sh" ]]; then
        ./network/scripts/deploy-chaincode.sh \
            || { log "ERROR" "Failed to deploy chaincode"; exit 1; }
    fi
    
    log "SUCCESS" "Blockchain network deployed successfully"
}

# Deploy validator services
deploy_services() {
    log "INFO" "Deploying validator services..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would deploy validator services"
        return 0
    fi
    
    # Start validator services
    docker-compose -f docker-compose.yaml up -d \
        national-bank-validator \
        bank-api-validator \
        quality-authority-validator \
        customs-validator \
        api-gateway \
        || { log "ERROR" "Failed to start validator services"; exit 1; }
    
    log "SUCCESS" "Validator services deployed successfully"
}

# Deploy frontend
deploy_frontend() {
    log "INFO" "Deploying frontend application..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would deploy frontend application"
        return 0
    fi
    
    cd "$PROJECT_ROOT/frontend"
    
    case $ENVIRONMENT in
        "development")
            log "INFO" "Starting development frontend server..."
            npm install
            npm run dev &
            FRONTEND_PID=$!
            echo $FRONTEND_PID > "$LOGS_DIR/frontend.pid"
            ;;
        "staging"|"production")
            log "INFO" "Building and serving production frontend..."
            npm ci --production
            npm run build
            npm run preview &
            FRONTEND_PID=$!
            echo $FRONTEND_PID > "$LOGS_DIR/frontend.pid"
            ;;
    esac
    
    cd "$PROJECT_ROOT"
    log "SUCCESS" "Frontend application deployed successfully"
}

# Deploy monitoring stack
deploy_monitoring() {
    log "INFO" "Deploying monitoring stack..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would deploy monitoring stack"
        return 0
    fi
    
    # Create monitoring configuration
    local monitoring_config="$DEPLOY_DIR/monitoring/docker-compose.monitoring.yaml"
    
    if [[ -f "$monitoring_config" ]]; then
        docker-compose -f "$monitoring_config" up -d \
            || { log "ERROR" "Failed to start monitoring stack"; exit 1; }
        log "SUCCESS" "Monitoring stack deployed successfully"
    else
        log "WARNING" "Monitoring configuration not found: $monitoring_config"
        log "INFO" "Skipping monitoring deployment"
    fi
}

# Perform health checks
perform_health_checks() {
    if [[ "$SKIP_HEALTH_CHECKS" == "true" ]]; then
        log "INFO" "Skipping health checks (SKIP_HEALTH_CHECKS=true)"
        return 0
    fi
    
    log "INFO" "Performing health checks..."
    
    local services=(
        "API Gateway:http://localhost:8000/health"
        "National Bank Validator:http://localhost:8083/health"
        "Quality Authority Validator:http://localhost:8081/health"
        "Customs Validator:http://localhost:8082/health"
        "Bank API Validator:http://localhost:5000/health"
        "IPFS:http://localhost:5001/api/v0/id"
    )
    
    local failed_services=()
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name service_url <<< "$service_info"
        
        log "INFO" "Checking $service_name at $service_url..."
        
        local retries=0
        local max_retries=10
        local retry_delay=3
        
        while [[ $retries -lt $max_retries ]]; do
            if curl -s --max-time 5 "$service_url" > /dev/null 2>&1; then
                log "SUCCESS" "$service_name is healthy"
                break
            else
                retries=$((retries + 1))
                if [[ $retries -lt $max_retries ]]; then
                    log "DEBUG" "$service_name not ready, retrying in ${retry_delay}s... ($retries/$max_retries)"
                    sleep $retry_delay
                else
                    log "ERROR" "$service_name failed health check"
                    failed_services+=("$service_name")
                fi
            fi
        done
    done
    
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        log "SUCCESS" "All health checks passed"
    else
        log "ERROR" "Failed health checks: ${failed_services[*]}"
        return 1
    fi
}

# Run deployment tests
run_deployment_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log "INFO" "Skipping deployment tests (SKIP_TESTS=true)"
        return 0
    fi
    
    log "INFO" "Running deployment tests..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would run deployment tests"
        return 0
    fi
    
    # Run test suite if available
    local test_script="$DEPLOY_DIR/tests/integration-tests.sh"
    
    if [[ -f "$test_script" ]]; then
        log "INFO" "Running integration tests..."
        "$test_script" || { log "ERROR" "Integration tests failed"; return 1; }
        log "SUCCESS" "Integration tests passed"
    else
        log "WARNING" "Integration test script not found: $test_script"
        
        # Basic connectivity tests
        log "INFO" "Running basic connectivity tests..."
        
        # Test API Gateway
        if curl -s "http://localhost:8000/health" | grep -q "healthy"; then
            log "SUCCESS" "API Gateway connectivity test passed"
        else
            log "ERROR" "API Gateway connectivity test failed"
            return 1
        fi
        
        # Test Frontend (if in development mode)
        if [[ "$ENVIRONMENT" == "development" ]]; then
            if curl -s "http://localhost:3000" > /dev/null; then
                log "SUCCESS" "Frontend connectivity test passed"
            else
                log "WARNING" "Frontend connectivity test failed"
            fi
        fi
    fi
    
    log "SUCCESS" "Deployment tests completed"
}

# Show deployment status
show_status() {
    log "INFO" "Deployment Status Report"
    echo
    echo "=== Container Status ==="
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo
    
    echo "=== Service Health ==="
    local services=(
        "API Gateway:http://localhost:8000/health"
        "Frontend:http://localhost:3000"
        "IPFS:http://localhost:5001/api/v0/id"
    )
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r service_name service_url <<< "$service_info"
        
        if curl -s --max-time 2 "$service_url" > /dev/null 2>&1; then
            echo -e "$service_name: ${GREEN}HEALTHY${NC}"
        else
            echo -e "$service_name: ${RED}UNHEALTHY${NC}"
        fi
    done
    echo
    
    echo "=== Resource Usage ==="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    echo
}

# Show deployment logs
show_logs() {
    local service=${1:-"all"}
    
    if [[ "$service" == "all" ]]; then
        echo "=== Recent Deployment Logs ==="
        tail -50 "$DEPLOYMENT_LOG"
    else
        echo "=== Container Logs for $service ==="
        docker logs --tail=50 "$service"
    fi
}

# Cleanup deployment
cleanup_deployment() {
    log "INFO" "Cleaning up deployment..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would clean up all resources"
        return 0
    fi
    
    # Stop and remove containers
    docker-compose down -v --remove-orphans
    
    # Stop frontend if running
    if [[ -f "$LOGS_DIR/frontend.pid" ]]; then
        local frontend_pid=$(cat "$LOGS_DIR/frontend.pid")
        if kill -0 "$frontend_pid" 2>/dev/null; then
            kill "$frontend_pid"
            log "INFO" "Stopped frontend process"
        fi
        rm -f "$LOGS_DIR/frontend.pid"
    fi
    
    # Clean up Docker resources
    docker system prune -f
    
    log "SUCCESS" "Cleanup completed"
}

# Main deployment function
deploy_full() {
    log "INFO" "Starting full deployment to $ENVIRONMENT environment..."
    
    local start_time=$(date +%s)
    
    # Execute deployment steps
    check_prerequisites
    load_environment_config
    build_services
    deploy_blockchain
    deploy_services
    deploy_frontend
    deploy_monitoring
    
    # Wait for services to stabilize
    log "INFO" "Waiting for services to stabilize..."
    sleep 10
    
    # Health checks and tests
    perform_health_checks
    run_deployment_tests
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log "SUCCESS" "Full deployment completed successfully in ${duration}s"
    log "INFO" "Access the application at:"
    log "INFO" "  - Frontend: http://localhost:3000"
    log "INFO" "  - API Gateway: http://localhost:8000"
    log "INFO" "  - Health Status: http://localhost:8000/health"
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -m|--mode)
                MODE="$2"
                shift 2
                ;;
            -t|--timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS="true"
                shift
                ;;
            --skip-health-checks)
                SKIP_HEALTH_CHECKS="true"
                shift
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            --verbose)
                VERBOSE="true"
                shift
                ;;
            -h|--help)
                print_usage
                exit 0
                ;;
            full|blockchain|services|frontend|monitoring|cleanup|status|logs|test)
                MODE="$1"
                shift
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done
}

# Main execution
main() {
    # Parse arguments
    parse_arguments "$@"
    
    # Print header
    print_header
    
    # Execute based on mode
    case $MODE in
        "full")
            deploy_full
            ;;
        "blockchain")
            check_prerequisites
            load_environment_config
            deploy_blockchain
            ;;
        "services")
            check_prerequisites
            load_environment_config
            build_services
            deploy_services
            ;;
        "frontend")
            check_prerequisites
            load_environment_config
            deploy_frontend
            ;;
        "monitoring")
            check_prerequisites
            load_environment_config
            deploy_monitoring
            ;;
        "cleanup")
            cleanup_deployment
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2"
            ;;
        "test")
            run_deployment_tests
            ;;
        *)
            log "ERROR" "Unknown mode: $MODE"
            print_usage
            exit 1
            ;;
    esac
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi