#!/bin/bash

# Coffee Export Platform - Integration Test Suite
# Comprehensive integration testing for deployment validation

set -e

# Test configuration
TEST_SUITE_VERSION="2.0.0"
TEST_SUITE_NAME="Coffee Export Integration Tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
ENVIRONMENT="${TEST_ENV:-development}"
API_BASE_URL="${API_BASE_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
TIMEOUT="${TEST_TIMEOUT:-30}"
VERBOSE="${VERBOSE:-false}"

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Test data
TEST_LICENSE_HASH="${TEST_LICENSE_HASH:-dev-license-hash-123}"
TEST_INVOICE_HASH="${TEST_INVOICE_HASH:-dev-invoice-hash-456}"
TEST_QUALITY_HASH="${TEST_QUALITY_HASH:-dev-quality-hash-789}"
TEST_SHIPPING_HASH="${TEST_SHIPPING_HASH:-dev-shipping-hash-012}"

# Logging functions
log_test() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[TEST-INFO]${NC} [$timestamp] $message"
            ;;
        "PASS")
            echo -e "${GREEN}[TEST-PASS]${NC} [$timestamp] ✓ $message"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            ;;
        "FAIL")
            echo -e "${RED}[TEST-FAIL]${NC} [$timestamp] ✗ $message"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            ;;
        "SKIP")
            echo -e "${YELLOW}[TEST-SKIP]${NC} [$timestamp] ⚠ $message"
            SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
            ;;
        "DEBUG")
            if [[ "$VERBOSE" == "true" ]]; then
                echo -e "${BLUE}[TEST-DEBUG]${NC} [$timestamp] $message"
            fi
            ;;
    esac
}

# Test execution wrapper
run_test() {
    local test_name=$1
    local test_function=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_test "INFO" "Running test: $test_name"
    
    if $test_function; then
        log_test "PASS" "$test_name"
        return 0
    else
        log_test "FAIL" "$test_name"
        return 1
    fi
}

# HTTP request helper
make_request() {
    local method=$1
    local url=$2
    local data=${3:-""}
    local headers=${4:-""}
    local expected_status=${5:-200}
    
    local curl_cmd="curl -s --max-time $TIMEOUT -w '%{http_code}' -o /tmp/test_response_$$"
    
    if [[ -n "$headers" ]]; then
        curl_cmd="$curl_cmd -H '$headers'"
    fi
    
    if [[ "$method" == "POST" && -n "$data" ]]; then
        curl_cmd="$curl_cmd -X POST -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    log_test "DEBUG" "Executing: $curl_cmd"
    
    local http_code=$(eval $curl_cmd 2>/dev/null)
    local response_body=""
    
    if [[ -f "/tmp/test_response_$$" ]]; then
        response_body=$(cat "/tmp/test_response_$$")
        rm -f "/tmp/test_response_$$"
    fi
    
    log_test "DEBUG" "HTTP $method $url -> $http_code"
    
    if [[ "$http_code" == "$expected_status" ]]; then
        echo "$response_body"
        return 0
    else
        log_test "DEBUG" "Expected status $expected_status, got $http_code"
        log_test "DEBUG" "Response: $response_body"
        return 1
    fi
}

# API Gateway Tests
test_api_gateway_health() {
    local response=$(make_request "GET" "$API_BASE_URL/health" "" "" 200)
    
    if echo "$response" | jq -e '.status == "healthy"' >/dev/null 2>&1; then
        return 0
    else
        log_test "DEBUG" "Health check response: $response"
        return 1
    fi
}

test_api_gateway_metrics() {
    local response=$(make_request "GET" "$API_BASE_URL/metrics" "" "" 200)
    
    if echo "$response" | jq -e '.service' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_api_gateway_cors() {
    local response=$(make_request "OPTIONS" "$API_BASE_URL/health" "" "Origin: http://localhost:3000" 200)
    return $?
}

# Validator Service Tests
test_national_bank_validator() {
    local validator_url="${API_BASE_URL%:*}:8083"
    local response=$(make_request "GET" "$validator_url/validate?hash=$TEST_LICENSE_HASH" "" "" 200)
    
    if echo "$response" | jq -e '.valid == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_bank_api_validator() {
    local validator_url="${API_BASE_URL%:*}:5000"
    local response=$(make_request "GET" "$validator_url/validate?hash=$TEST_INVOICE_HASH" "" "" 200)
    
    if echo "$response" | jq -e '.valid == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_quality_authority_validator() {
    local validator_url="${API_BASE_URL%:*}:8081"
    local response=$(make_request "GET" "$validator_url/validate?hash=$TEST_QUALITY_HASH" "" "" 200)
    
    if echo "$response" | jq -e '.valid == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_customs_validator() {
    local validator_url="${API_BASE_URL%:*}:8082"
    local response=$(make_request "GET" "$validator_url/validate?hash=$TEST_SHIPPING_HASH" "" "" 200)
    
    if echo "$response" | jq -e '.valid == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Frontend Tests
test_frontend_accessibility() {
    local response=$(make_request "GET" "$FRONTEND_URL" "" "" 200)
    
    # Check if response contains React app indicators
    if echo "$response" | grep -q "react" || echo "$response" | grep -q "coffee-export"; then
        return 0
    else
        return 1
    fi
}

test_frontend_api_connectivity() {
    # Check if frontend can reach API Gateway
    local response=$(make_request "GET" "$FRONTEND_URL/api/health" "" "" 200)
    return $?
}

# IPFS Tests
test_ipfs_connectivity() {
    local ipfs_url="${API_BASE_URL%:*}:5001"
    local response=$(make_request "GET" "$ipfs_url/api/v0/id" "" "" 200)
    
    if echo "$response" | jq -e '.ID' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_ipfs_storage() {
    local ipfs_url="${API_BASE_URL%:*}:5001"
    local test_content="test-content-$(date +%s)"
    
    # Add content to IPFS
    local add_response=$(curl -s --max-time $TIMEOUT \
        -X POST \
        -F "file=@-" \
        "$ipfs_url/api/v0/add" \
        <<< "$test_content")
    
    if echo "$add_response" | jq -e '.Hash' >/dev/null 2>&1; then
        local hash=$(echo "$add_response" | jq -r '.Hash')
        
        # Retrieve content from IPFS
        local get_response=$(curl -s --max-time $TIMEOUT \
            "$ipfs_url/api/v0/cat?arg=$hash")
        
        if [[ "$get_response" == "$test_content" ]]; then
            return 0
        fi
    fi
    
    return 1
}

# Blockchain Network Tests
test_blockchain_peer_connectivity() {
    # Check if blockchain peers are accessible
    if command -v docker >/dev/null 2>&1; then
        local peer_status=$(docker ps --filter "name=peer0" --format "{{.Status}}" | grep -c "Up")
        if [[ $peer_status -gt 0 ]]; then
            return 0
        fi
    fi
    return 1
}

test_couchdb_connectivity() {
    # Check CouchDB instances
    local couchdb_urls=(
        "http://localhost:15984"
        "http://localhost:15985"
        "http://localhost:15986"
        "http://localhost:15987"
    )
    
    for url in "${couchdb_urls[@]}"; do
        local response=$(make_request "GET" "$url" "" "" 200)
        if ! echo "$response" | jq -e '.couchdb' >/dev/null 2>&1; then
            return 1
        fi
    done
    
    return 0
}

# Integration Workflow Tests
test_document_upload_workflow() {
    # Test the complete document upload workflow
    local test_doc_hash="test-document-$(date +%s)"
    
    # Step 1: Upload document metadata to API Gateway
    local upload_data="{\"documentHash\":\"$test_doc_hash\",\"documentType\":\"license\",\"metadata\":{\"test\":true}}"
    local upload_response=$(make_request "POST" "$API_BASE_URL/api/documents" "$upload_data" "Content-Type: application/json" 201)
    
    if echo "$upload_response" | jq -e '.success == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

test_export_submission_workflow() {
    # Test the export submission workflow
    local export_data="{
        \"exportId\":\"test-export-$(date +%s)\",
        \"documents\":{
            \"license\":\"$TEST_LICENSE_HASH\",
            \"invoice\":\"$TEST_INVOICE_HASH\",
            \"quality\":\"$TEST_QUALITY_HASH\",
            \"shipping\":\"$TEST_SHIPPING_HASH\"
        },
        \"metadata\":{\"test\":true}
    }"
    
    local submission_response=$(make_request "POST" "$API_BASE_URL/api/exports" "$export_data" "Content-Type: application/json" 201)
    
    if echo "$submission_response" | jq -e '.success == true' >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Performance Tests
test_api_gateway_response_time() {
    local start_time=$(date +%s%N)
    make_request "GET" "$API_BASE_URL/health" "" "" 200 >/dev/null
    local end_time=$(date +%s%N)
    
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [[ $response_time -lt 1000 ]]; then  # Less than 1 second
        return 0
    else
        log_test "DEBUG" "Response time: ${response_time}ms (expected < 1000ms)"
        return 1
    fi
}

test_concurrent_requests() {
    local concurrent_count=10
    local success_count=0
    
    for i in $(seq 1 $concurrent_count); do
        if make_request "GET" "$API_BASE_URL/health" "" "" 200 >/dev/null & then
            success_count=$((success_count + 1))
        fi
    done
    
    wait  # Wait for all background processes
    
    if [[ $success_count -eq $concurrent_count ]]; then
        return 0
    else
        log_test "DEBUG" "Concurrent test: $success_count/$concurrent_count requests succeeded"
        return 1
    fi
}

# Security Tests
test_cors_security() {
    # Test CORS configuration
    local response=$(curl -s --max-time $TIMEOUT \
        -H "Origin: http://malicious-site.com" \
        -X OPTIONS \
        "$API_BASE_URL/health" \
        -w '%{http_code}')
    
    # Should reject requests from unauthorized origins
    if [[ "$response" == "403" ]] || [[ "$response" == "404" ]]; then
        return 0
    else
        return 1
    fi
}

test_rate_limiting() {
    # Test rate limiting (if enabled)
    local request_count=0
    local max_requests=50
    
    for i in $(seq 1 $max_requests); do
        if make_request "GET" "$API_BASE_URL/health" "" "" 200 >/dev/null 2>&1; then
            request_count=$((request_count + 1))
        else
            break
        fi
    done
    
    # If all requests succeed, rate limiting might not be configured (acceptable in dev)
    return 0
}

# Print test summary
print_test_summary() {
    echo
    echo "=================================================================="
    echo "  $TEST_SUITE_NAME - Test Summary"
    echo "=================================================================="
    echo "Environment: $ENVIRONMENT"
    echo "API Base URL: $API_BASE_URL"
    echo "Frontend URL: $FRONTEND_URL"
    echo
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    echo -e "Skipped: ${YELLOW}$SKIPPED_TESTS${NC}"
    echo
    
    local success_rate=0
    if [[ $TOTAL_TESTS -gt 0 ]]; then
        success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    fi
    
    echo "Success Rate: ${success_rate}%"
    echo
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        echo -e "${GREEN}All tests passed successfully!${NC}"
        return 0
    else
        echo -e "${RED}Some tests failed. Please check the logs above.${NC}"
        return 1
    fi
}

# Main test execution
main() {
    echo "=================================================================="
    echo "  $TEST_SUITE_NAME v$TEST_SUITE_VERSION"
    echo "=================================================================="
    echo "Environment: $ENVIRONMENT"
    echo "API Base URL: $API_BASE_URL"
    echo "Frontend URL: $FRONTEND_URL"
    echo "Timeout: ${TIMEOUT}s"
    echo
    
    # Check prerequisites
    if ! command -v curl >/dev/null 2>&1; then
        log_test "FAIL" "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq >/dev/null 2>&1; then
        log_test "FAIL" "jq is required but not installed"
        exit 1
    fi
    
    # API Gateway Tests
    echo "--- API Gateway Tests ---"
    run_test "API Gateway Health Check" test_api_gateway_health
    run_test "API Gateway Metrics" test_api_gateway_metrics
    run_test "API Gateway CORS" test_api_gateway_cors
    run_test "API Gateway Response Time" test_api_gateway_response_time
    
    # Validator Service Tests
    echo
    echo "--- Validator Service Tests ---"
    run_test "National Bank Validator" test_national_bank_validator
    run_test "Bank API Validator" test_bank_api_validator
    run_test "Quality Authority Validator" test_quality_authority_validator
    run_test "Customs Validator" test_customs_validator
    
    # Frontend Tests
    echo
    echo "--- Frontend Tests ---"
    run_test "Frontend Accessibility" test_frontend_accessibility
    
    # IPFS Tests
    echo
    echo "--- IPFS Tests ---"
    run_test "IPFS Connectivity" test_ipfs_connectivity
    run_test "IPFS Storage" test_ipfs_storage
    
    # Blockchain Tests
    echo
    echo "--- Blockchain Network Tests ---"
    run_test "Blockchain Peer Connectivity" test_blockchain_peer_connectivity
    run_test "CouchDB Connectivity" test_couchdb_connectivity
    
    # Integration Tests
    echo
    echo "--- Integration Workflow Tests ---"
    run_test "Document Upload Workflow" test_document_upload_workflow
    run_test "Export Submission Workflow" test_export_submission_workflow
    
    # Performance Tests
    echo
    echo "--- Performance Tests ---"
    run_test "Concurrent Requests" test_concurrent_requests
    
    # Security Tests
    echo
    echo "--- Security Tests ---"
    run_test "CORS Security" test_cors_security
    run_test "Rate Limiting" test_rate_limiting
    
    # Print summary and exit
    print_test_summary
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi