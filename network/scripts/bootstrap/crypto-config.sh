#!/bin/bash

# Crypto Configuration Automation Script
# Generates all cryptographic materials for the Coffee Export Blockchain System

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETWORK_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CRYPTO_CONFIG_DIR="$NETWORK_ROOT/organizations"
CRYPTO_CONFIG_FILE="$NETWORK_ROOT/organizations/cryptogen/crypto-config.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --generate-all      Generate all cryptographic materials"
    echo "  --clean             Clean existing crypto materials before generation"
    echo "  --org ORG_NAME      Generate crypto materials for specific organization"
    echo "  --verify            Verify existing crypto materials"
    echo "  --help              Show this help message"
    echo ""
    echo "Organizations:"
    echo "  - OrdererOrg (orderer.coffee-consortium.com)"
    echo "  - NationalBank (nationalbank.com)"
    echo "  - ExporterBank (exporterbank.com)"
    echo "  - CoffeeAuthority (coffeeauthority.com)"
    echo "  - Customs (customs.com)"
}

# Create crypto-config.yaml
create_crypto_config() {
    log_info "Creating crypto-config.yaml"
    
    mkdir -p "$(dirname "$CRYPTO_CONFIG_FILE")"
    
    cat > "$CRYPTO_CONFIG_FILE" << 'EOF'
# Crypto configuration for Coffee Export Blockchain System

OrdererOrgs:
  - Name: Orderer
    Domain: coffee-consortium.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer
        SANS:
          - localhost
          - 127.0.0.1
          - orderer.coffee-consortium.com

PeerOrgs:
  - Name: NationalBank
    Domain: nationalbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.nationalbank.com"
    Users:
      Count: 2

  - Name: ExporterBank
    Domain: exporterbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.exporterbank.com"
    Users:
      Count: 2

  - Name: CoffeeAuthority
    Domain: coffeeauthority.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.coffeeauthority.com"
    Users:
      Count: 2

  - Name: Customs
    Domain: customs.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.customs.com"
    Users:
      Count: 2
EOF

    log_info "crypto-config.yaml created successfully"
}

# Generate crypto materials using cryptogen
generate_crypto_materials() {
    local org_filter="$1"
    
    log_info "Generating cryptographic materials"
    
    # Check if cryptogen is available
    if ! command -v cryptogen &> /dev/null; then
        log_error "cryptogen not found. Please ensure Fabric binaries are installed."
        log_info "Run: ./fabric-binaries.sh to install binaries"
        return 1
    fi
    
    # Create crypto-config.yaml if it doesn't exist
    if [[ ! -f "$CRYPTO_CONFIG_FILE" ]]; then
        create_crypto_config
    fi
    
    # Generate crypto materials
    log_info "Running cryptogen generate..."
    
    cd "$NETWORK_ROOT"
    
    if [[ -n "$org_filter" ]]; then
        log_info "Generating crypto materials for organization: $org_filter"
        # For specific org, we need to create a temporary config
        local temp_config="/tmp/crypto-config-${org_filter}.yaml"
        create_org_specific_config "$org_filter" "$temp_config"
        
        if ! cryptogen generate --config="$temp_config" --output="$CRYPTO_CONFIG_DIR"; then
            log_error "Failed to generate crypto materials for $org_filter"
            rm -f "$temp_config"
            return 1
        fi
        
        rm -f "$temp_config"
    else
        if ! cryptogen generate --config="$CRYPTO_CONFIG_FILE" --output="$CRYPTO_CONFIG_DIR"; then
            log_error "Failed to generate crypto materials"
            return 1
        fi
    fi
    
    log_info "Cryptographic materials generated successfully"
}

# Create organization-specific crypto config
create_org_specific_config() {
    local org_name="$1"
    local output_file="$2"
    
    case "$org_name" in
        "OrdererOrg"|"Orderer")
            cat > "$output_file" << 'EOF'
OrdererOrgs:
  - Name: Orderer
    Domain: coffee-consortium.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer
        SANS:
          - localhost
          - 127.0.0.1
          - orderer.coffee-consortium.com
PeerOrgs: []
EOF
            ;;
        "NationalBank")
            cat > "$output_file" << 'EOF'
OrdererOrgs: []
PeerOrgs:
  - Name: NationalBank
    Domain: nationalbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.nationalbank.com"
    Users:
      Count: 2
EOF
            ;;
        "ExporterBank")
            cat > "$output_file" << 'EOF'
OrdererOrgs: []
PeerOrgs:
  - Name: ExporterBank
    Domain: exporterbank.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.exporterbank.com"
    Users:
      Count: 2
EOF
            ;;
        "CoffeeAuthority")
            cat > "$output_file" << 'EOF'
OrdererOrgs: []
PeerOrgs:
  - Name: CoffeeAuthority
    Domain: coffeeauthority.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.coffeeauthority.com"
    Users:
      Count: 2
EOF
            ;;
        "Customs")
            cat > "$output_file" << 'EOF'
OrdererOrgs: []
PeerOrgs:
  - Name: Customs
    Domain: customs.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - 127.0.0.1
        - "{{.Hostname}}.customs.com"
    Users:
      Count: 2
EOF
            ;;
        *)
            log_error "Unknown organization: $org_name"
            return 1
            ;;
    esac
}

# Verify crypto materials
verify_crypto_materials() {
    log_info "Verifying cryptographic materials"
    
    local errors=0
    
    # Check orderer organization
    local orderer_msp="$CRYPTO_CONFIG_DIR/ordererOrganizations/coffee-consortium.com"
    if [[ ! -d "$orderer_msp" ]]; then
        log_error "Orderer MSP directory not found: $orderer_msp"
        errors=$((errors + 1))
    else
        log_debug "Checking orderer certificates..."
        verify_msp_structure "$orderer_msp/msp" "OrdererMSP"
        verify_orderer_tls "$orderer_msp/orderers/orderer.coffee-consortium.com"
    fi
    
    # Check peer organizations
    local peer_orgs=("nationalbank.com" "exporterbank.com" "coffeeauthority.com" "customs.com")
    local msp_ids=("NationalBankMSP" "ExporterBankMSP" "CoffeeAuthorityMSP" "CustomsMSP")
    
    for i in "${!peer_orgs[@]}"; do
        local org_domain="${peer_orgs[$i]}"
        local msp_id="${msp_ids[$i]}"
        local peer_org_dir="$CRYPTO_CONFIG_DIR/peerOrganizations/$org_domain"
        
        if [[ ! -d "$peer_org_dir" ]]; then
            log_error "Peer organization directory not found: $peer_org_dir"
            errors=$((errors + 1))
            continue
        fi
        
        log_debug "Checking $org_domain certificates..."
        verify_msp_structure "$peer_org_dir/msp" "$msp_id"
        verify_peer_structure "$peer_org_dir" "$org_domain"
    done
    
    if [[ $errors -eq 0 ]]; then
        log_info "All cryptographic materials verified successfully"
        return 0
    else
        log_error "Verification failed with $errors errors"
        return 1
    fi
}

# Verify MSP structure
verify_msp_structure() {
    local msp_dir="$1"
    local msp_id="$2"
    
    local required_dirs=("admincerts" "cacerts" "tlscacerts")
    local required_files=("config.yaml")
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$msp_dir/$dir" ]]; then
            log_error "Missing MSP directory: $msp_dir/$dir"
            return 1
        fi
    done
    
    # Check if cacerts has certificates
    if [[ -z "$(find "$msp_dir/cacerts" -name "*.pem" 2>/dev/null)" ]]; then
        log_error "No CA certificates found in $msp_dir/cacerts"
        return 1
    fi
    
    # Check if tlscacerts has certificates
    if [[ -z "$(find "$msp_dir/tlscacerts" -name "*.pem" 2>/dev/null)" ]]; then
        log_error "No TLS CA certificates found in $msp_dir/tlscacerts"
        return 1
    fi
    
    log_debug "MSP structure verified: $msp_id"
}

# Verify orderer TLS structure
verify_orderer_tls() {
    local orderer_dir="$1"
    
    local required_files=("tls/ca.crt" "tls/server.crt" "tls/server.key")
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$orderer_dir/$file" ]]; then
            log_error "Missing orderer TLS file: $orderer_dir/$file"
            return 1
        fi
    done
    
    log_debug "Orderer TLS structure verified"
}

# Verify peer structure
verify_peer_structure() {
    local peer_org_dir="$1"
    local org_domain="$2"
    
    # Check peer0 structure
    local peer_dir="$peer_org_dir/peers/peer0.$org_domain"
    if [[ ! -d "$peer_dir" ]]; then
        log_error "Peer directory not found: $peer_dir"
        return 1
    fi
    
    # Check peer TLS certificates
    local peer_tls_files=("tls/ca.crt" "tls/server.crt" "tls/server.key")
    for file in "${peer_tls_files[@]}"; do
        if [[ ! -f "$peer_dir/$file" ]]; then
            log_error "Missing peer TLS file: $peer_dir/$file"
            return 1
        fi
    done
    
    # Check users
    local users_dir="$peer_org_dir/users"
    if [[ ! -d "$users_dir" ]]; then
        log_error "Users directory not found: $users_dir"
        return 1
    fi
    
    # Check admin user
    local admin_dir="$users_dir/Admin@$org_domain"
    if [[ ! -d "$admin_dir/msp" ]]; then
        log_error "Admin MSP not found: $admin_dir/msp"
        return 1
    fi
    
    log_debug "Peer structure verified: $org_domain"
}

# Clean existing crypto materials
clean_crypto_materials() {
    log_warn "Cleaning existing cryptographic materials"
    
    if [[ -d "$CRYPTO_CONFIG_DIR/ordererOrganizations" ]]; then
        rm -rf "$CRYPTO_CONFIG_DIR/ordererOrganizations"
        log_info "Removed orderer organizations"
    fi
    
    if [[ -d "$CRYPTO_CONFIG_DIR/peerOrganizations" ]]; then
        rm -rf "$CRYPTO_CONFIG_DIR/peerOrganizations"
        log_info "Removed peer organizations"
    fi
    
    log_info "Crypto materials cleaned"
}

# Set proper permissions on crypto materials
set_crypto_permissions() {
    log_info "Setting proper permissions on crypto materials"
    
    # Set directory permissions
    find "$CRYPTO_CONFIG_DIR" -type d -exec chmod 755 {} \;
    
    # Set file permissions
    find "$CRYPTO_CONFIG_DIR" -type f -exec chmod 644 {} \;
    
    # Set private key permissions
    find "$CRYPTO_CONFIG_DIR" -name "*_sk" -exec chmod 600 {} \;
    find "$CRYPTO_CONFIG_DIR" -name "priv_sk" -exec chmod 600 {} \;
    find "$CRYPTO_CONFIG_DIR" -name "server.key" -exec chmod 600 {} \;
    
    log_info "Permissions set successfully"
}

# Create MSP configuration files
create_msp_configs() {
    log_info "Creating MSP configuration files"
    
    # Organizations and their MSP IDs
    local orgs=(
        "ordererOrganizations/coffee-consortium.com:OrdererMSP"
        "peerOrganizations/nationalbank.com:NationalBankMSP"
        "peerOrganizations/exporterbank.com:ExporterBankMSP"
        "peerOrganizations/coffeeauthority.com:CoffeeAuthorityMSP"
        "peerOrganizations/customs.com:CustomsMSP"
    )
    
    for org_info in "${orgs[@]}"; do
        local org_path="${org_info%:*}"
        local msp_id="${org_info#*:}"
        local msp_dir="$CRYPTO_CONFIG_DIR/$org_path/msp"
        
        if [[ -d "$msp_dir" ]]; then
            create_msp_config_file "$msp_dir" "$msp_id"
        fi
    done
}

# Create individual MSP config file
create_msp_config_file() {
    local msp_dir="$1"
    local msp_id="$2"
    local config_file="$msp_dir/config.yaml"
    
    cat > "$config_file" << EOF
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/ca.${msp_id,,}.com-cert.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/ca.${msp_id,,}.com-cert.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/ca.${msp_id,,}.com-cert.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/ca.${msp_id,,}.com-cert.pem
    OrganizationalUnitIdentifier: orderer
EOF
    
    log_debug "Created MSP config for $msp_id"
}

# Main function
main() {
    local generate_all="false"
    local clean_first="false"
    local org_filter=""
    local verify_only="false"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --generate-all)
                generate_all="true"
                shift
                ;;
            --clean)
                clean_first="true"
                shift
                ;;
            --org)
                org_filter="$2"
                shift 2
                ;;
            --verify)
                verify_only="true"
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log_info "Starting crypto configuration setup"
    
    if [[ "$verify_only" == "true" ]]; then
        verify_crypto_materials
        exit $?
    fi
    
    if [[ "$clean_first" == "true" ]]; then
        clean_crypto_materials
    fi
    
    if [[ "$generate_all" == "true" ]] || [[ -n "$org_filter" ]]; then
        if ! generate_crypto_materials "$org_filter"; then
            log_error "Failed to generate crypto materials"
            exit 1
        fi
        
        create_msp_configs
        set_crypto_permissions
        
        log_info "Verifying generated materials..."
        if ! verify_crypto_materials; then
            log_error "Verification failed"
            exit 1
        fi
    else
        log_error "No action specified. Use --generate-all or --org <ORG_NAME>"
        show_usage
        exit 1
    fi
    
    log_info "Crypto configuration completed successfully"
}

# Run main function
main "$@"