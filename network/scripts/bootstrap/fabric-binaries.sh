#!/bin/bash

# Fabric Binaries Download and Configuration Script
# Downloads and configures Hyperledger Fabric binaries for the Coffee Export System

set -e

# Default configuration
FABRIC_VERSION=${FABRIC_VERSION:-"2.5.0"}
CA_VERSION=${CA_VERSION:-"1.5.0"}
ARCH=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH_SUFFIX=""

# Determine architecture
case "$(uname -m)" in
    x86_64)
        ARCH_SUFFIX="-amd64"
        ;;
    aarch64|arm64)
        ARCH_SUFFIX="-arm64"
        ;;
    *)
        echo "Unsupported architecture: $(uname -m)"
        exit 1
        ;;
esac

# Configuration
FABRIC_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BIN_DIR="${FABRIC_ROOT}/bin"
CONFIG_DIR="${FABRIC_ROOT}/config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --version VERSION    Fabric version to download (default: ${FABRIC_VERSION})"
    echo "  --ca-version VERSION CA version to download (default: ${CA_VERSION})"
    echo "  --force             Force re-download even if binaries exist"
    echo "  --verify-only       Only verify existing binaries"
    echo "  --help              Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  FABRIC_VERSION      Override default Fabric version"
    echo "  CA_VERSION          Override default CA version"
}

# Verify binary integrity
verify_binary() {
    local binary_path="$1"
    local binary_name="$2"
    
    if [[ ! -f "$binary_path" ]]; then
        log_error "Binary not found: $binary_path"
        return 1
    fi
    
    if [[ ! -x "$binary_path" ]]; then
        log_error "Binary not executable: $binary_path"
        return 1
    fi
    
    # Test binary execution
    case "$binary_name" in
        "peer")
            if ! "$binary_path" version &>/dev/null; then
                log_error "Binary test failed: $binary_name"
                return 1
            fi
            ;;
        "orderer")
            if ! "$binary_path" version &>/dev/null; then
                log_error "Binary test failed: $binary_name"
                return 1
            fi
            ;;
        "configtxgen"|"configtxlator"|"cryptogen"|"discover"|"idemixgen"|"osnadmin")
            if ! "$binary_path" --help &>/dev/null; then
                log_error "Binary test failed: $binary_name"
                return 1
            fi
            ;;
        "fabric-ca-client"|"fabric-ca-server")
            if ! "$binary_path" version &>/dev/null; then
                log_error "Binary test failed: $binary_name"
                return 1
            fi
            ;;
    esac
    
    log_info "Binary verified: $binary_name"
    return 0
}

# Download and extract Fabric binaries
download_fabric_binaries() {
    local version="$1"
    local force_download="$2"
    
    log_info "Downloading Hyperledger Fabric binaries version $version"
    
    # Create directories
    mkdir -p "$BIN_DIR"
    mkdir -p "$CONFIG_DIR"
    
    # Check if binaries already exist
    if [[ "$force_download" != "true" ]] && [[ -f "$BIN_DIR/peer" ]]; then
        log_warn "Fabric binaries already exist. Use --force to re-download."
        return 0
    fi
    
    # Download URL
    local download_url="https://github.com/hyperledger/fabric/releases/download/v${version}/hyperledger-fabric-${ARCH}${ARCH_SUFFIX}-${version}.tar.gz"
    local temp_file="/tmp/hyperledger-fabric-${version}.tar.gz"
    
    log_info "Downloading from: $download_url"
    
    # Download with retry logic
    local max_retries=3
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        if curl -L -o "$temp_file" "$download_url"; then
            break
        else
            retry_count=$((retry_count + 1))
            if [[ $retry_count -lt $max_retries ]]; then
                log_warn "Download failed, retrying in 5 seconds... (attempt $retry_count/$max_retries)"
                sleep 5
            else
                log_error "Failed to download Fabric binaries after $max_retries attempts"
                return 1
            fi
        fi
    done
    
    # Extract binaries
    log_info "Extracting Fabric binaries"
    if ! tar -xzf "$temp_file" -C "$FABRIC_ROOT"; then
        log_error "Failed to extract Fabric binaries"
        return 1
    fi
    
    # Clean up
    rm -f "$temp_file"
    
    # Set executable permissions
    chmod +x "$BIN_DIR"/*
    
    log_info "Fabric binaries downloaded and extracted successfully"
}

# Download and extract CA binaries
download_ca_binaries() {
    local version="$1"
    local force_download="$2"
    
    log_info "Downloading Hyperledger Fabric CA binaries version $version"
    
    # Check if CA binaries already exist
    if [[ "$force_download" != "true" ]] && [[ -f "$BIN_DIR/fabric-ca-client" ]]; then
        log_warn "CA binaries already exist. Use --force to re-download."
        return 0
    fi
    
    # Download URL
    local download_url="https://github.com/hyperledger/fabric-ca/releases/download/v${version}/hyperledger-fabric-ca-${ARCH}${ARCH_SUFFIX}-${version}.tar.gz"
    local temp_file="/tmp/hyperledger-fabric-ca-${version}.tar.gz"
    
    log_info "Downloading from: $download_url"
    
    # Download with retry logic
    local max_retries=3
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        if curl -L -o "$temp_file" "$download_url"; then
            break
        else
            retry_count=$((retry_count + 1))
            if [[ $retry_count -lt $max_retries ]]; then
                log_warn "Download failed, retrying in 5 seconds... (attempt $retry_count/$max_retries)"
                sleep 5
            else
                log_error "Failed to download CA binaries after $max_retries attempts"
                return 1
            fi
        fi
    done
    
    # Extract binaries
    log_info "Extracting CA binaries"
    if ! tar -xzf "$temp_file" -C "$FABRIC_ROOT"; then
        log_error "Failed to extract CA binaries"
        return 1
    fi
    
    # Clean up
    rm -f "$temp_file"
    
    # Set executable permissions
    chmod +x "$BIN_DIR"/fabric-ca-*
    
    log_info "CA binaries downloaded and extracted successfully"
}

# Verify all binaries
verify_all_binaries() {
    log_info "Verifying all binaries"
    
    local binaries=(
        "peer"
        "orderer"
        "configtxgen"
        "configtxlator"
        "cryptogen"
        "discover"
        "idemixgen"
        "osnadmin"
        "fabric-ca-client"
        "fabric-ca-server"
    )
    
    local failed_binaries=()
    
    for binary in "${binaries[@]}"; do
        if ! verify_binary "$BIN_DIR/$binary" "$binary"; then
            failed_binaries+=("$binary")
        fi
    done
    
    if [[ ${#failed_binaries[@]} -gt 0 ]]; then
        log_error "Failed to verify binaries: ${failed_binaries[*]}"
        return 1
    fi
    
    log_info "All binaries verified successfully"
}

# Create environment setup script
create_env_script() {
    local env_script="$FABRIC_ROOT/scripts/set-env.sh"
    
    log_info "Creating environment setup script: $env_script"
    
    cat > "$env_script" << EOF
#!/bin/bash

# Hyperledger Fabric Environment Setup
# Source this script to set up the environment for Fabric commands

# Add Fabric binaries to PATH
export PATH="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)/bin:\$PATH"

# Set Fabric configuration path
export FABRIC_CFG_PATH="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)/config"

# Fabric logging
export FABRIC_LOGGING_SPEC=INFO

# Colors for output
export FABRIC_COLOR=true

echo "Hyperledger Fabric environment configured"
echo "Fabric version: \$(peer version --short 2>/dev/null || echo 'Not available')"
echo "CA version: \$(fabric-ca-client version 2>/dev/null | head -1 || echo 'Not available')"
EOF
    
    chmod +x "$env_script"
    log_info "Environment setup script created"
}

# Main function
main() {
    local force_download="false"
    local verify_only="false"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version)
                FABRIC_VERSION="$2"
                shift 2
                ;;
            --ca-version)
                CA_VERSION="$2"
                shift 2
                ;;
            --force)
                force_download="true"
                shift
                ;;
            --verify-only)
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
    
    log_info "Starting Fabric binaries setup"
    log_info "Fabric version: $FABRIC_VERSION"
    log_info "CA version: $CA_VERSION"
    log_info "Architecture: $ARCH$ARCH_SUFFIX"
    
    if [[ "$verify_only" == "true" ]]; then
        verify_all_binaries
        exit $?
    fi
    
    # Check for required tools
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v tar &> /dev/null; then
        log_error "tar is required but not installed"
        exit 1
    fi
    
    # Download binaries
    if ! download_fabric_binaries "$FABRIC_VERSION" "$force_download"; then
        log_error "Failed to download Fabric binaries"
        exit 1
    fi
    
    if ! download_ca_binaries "$CA_VERSION" "$force_download"; then
        log_error "Failed to download CA binaries"
        exit 1
    fi
    
    # Verify binaries
    if ! verify_all_binaries; then
        log_error "Binary verification failed"
        exit 1
    fi
    
    # Create environment script
    create_env_script
    
    log_info "Fabric binaries setup completed successfully"
    log_info "To use the binaries, source the environment script:"
    log_info "  source $FABRIC_ROOT/scripts/set-env.sh"
}

# Run main function
main "$@"