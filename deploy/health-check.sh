#!/bin/bash

# Coffee Export Platform - Health Check and Monitoring Script
# Comprehensive health monitoring for all deployment environments

set -e

# Script configuration
SCRIPT_VERSION="2.0.0"
SCRIPT_NAME="Coffee Export Health Monitor"

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
DEFAULT_TIMEOUT="30"
DEFAULT_RETRIES="3"

# Configuration variables
ENVIRONMENT="${MONITOR_ENV:-$DEFAULT_ENVIRONMENT}"
TIMEOUT="${MONITOR_TIMEOUT:-$DEFAULT_TIMEOUT}"
RETRIES="${MONITOR_RETRIES:-$DEFAULT_RETRIES}"
VERBOSE="${VERBOSE:-false}"
OUTPUT_FORMAT="${OUTPUT_FORMAT:-console}"
CONTINUOUS_MODE="${CONTINUOUS_MODE:-false}"
INTERVAL="${INTERVAL:-60}"

# Health check endpoints based on environment
declare -A ENDPOINTS

case $ENVIRONMENT in
    "development")
        ENDPOINTS[api_gateway]="http://localhost:8000/health"
        ENDPOINTS[frontend]="http://localhost:3000"
        ENDPOINTS[national_bank_validator]="http://localhost:8083/health"
        ENDPOINTS[bank_api_validator]="http://localhost:5000/health"
        ENDPOINTS[quality_validator]="http://localhost:8081/health"
        ENDPOINTS[customs_validator]="http://localhost:8082/health"
        ENDPOINTS[ipfs]="http://localhost:5001/api/v0/id"
        ENDPOINTS[prometheus]="http://localhost:9090/-/healthy"
        ENDPOINTS[grafana]="http://localhost:3001/api/health"
        ;;
    "staging")
        ENDPOINTS[api_gateway]="https://staging-api.coffee-export.com/health"
        ENDPOINTS[frontend]="https://staging.coffee-export.com"
        ENDPOINTS[national_bank_validator]="https://staging-nb-validator.coffee-export.com/health"
        ENDPOINTS[bank_api_validator]="https://staging-bank-api.coffee-export.com/health"
        ENDPOINTS[quality_validator]="https://staging-quality.coffee-export.com/health"
        ENDPOINTS[customs_validator]="https://staging-customs.coffee-export.com/health"
        ENDPOINTS[monitoring]="https://staging-monitoring.coffee-export.com/health"
        ;;
    "production")
        ENDPOINTS[api_gateway]="https://api.coffee-export.com/health"
        ENDPOINTS[frontend]="https://app.coffee-export.com"
        ENDPOINTS[national_bank_validator]="https://nb-validator.coffee-export.com/health"
        ENDPOINTS[bank_api_validator]="https://bank-api.coffee-export.com/health"
        ENDPOINTS[quality_validator]="https://quality.coffee-export.com/health"
        ENDPOINTS[customs_validator]="https://customs.coffee-export.com/health"
        ENDPOINTS[monitoring]="https://monitoring.coffee-export.com/health"
        ;;
esac

# Logging functions
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        echo "{\"timestamp\":\"$timestamp\",\"level\":\"$level\",\"message\":\"$message\"}"
        return
    fi
    
    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} [$timestamp] $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} [$timestamp] $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} [$timestamp] $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} [$timestamp] $message"
            ;;
        "DEBUG")
            if [[ "$VERBOSE" == "true" ]]; then
                echo -e "${PURPLE}[DEBUG]${NC} [$timestamp] $message"
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
    check           Perform one-time health check (default)
    monitor         Continuous monitoring mode
    status          Show current system status
    metrics         Show performance metrics
    alerts          Check for active alerts
    report          Generate health report

OPTIONS:
    -e, --environment ENV     Target environment (development|staging|production)
    -t, --timeout SECONDS    Request timeout in seconds (default: 30)
    -r, --retries COUNT       Number of retries for failed checks (default: 3)
    -i, --interval SECONDS    Monitoring interval in seconds (default: 60)
    -f, --format FORMAT       Output format (console|json|prometheus) (default: console)
    -c, --continuous          Enable continuous monitoring mode
    --verbose                 Enable verbose logging
    -h, --help               Show this help message

ENVIRONMENT VARIABLES:
    MONITOR_ENV              Target environment
    MONITOR_TIMEOUT          Request timeout
    MONITOR_RETRIES          Number of retries
    VERBOSE                  Enable verbose mode
    OUTPUT_FORMAT            Output format
    CONTINUOUS_MODE          Enable continuous mode
    INTERVAL                 Monitoring interval

EXAMPLES:
    # Basic health check
    $0

    # Check production environment
    $0 --environment production

    # Continuous monitoring with JSON output
    $0 monitor --format json --interval 30

    # Generate comprehensive report
    $0 report --verbose

    # Check specific service status
    $0 status --environment staging

For more information, see: README.md
EOF
}

# Print header
print_header() {
    if [[ "$OUTPUT_FORMAT" != "json" ]]; then
        echo -e "${CYAN}"
        echo "=================================================================="
        echo "  $SCRIPT_NAME v$SCRIPT_VERSION"
        echo "=================================================================="
        echo -e "${NC}"
        echo "Environment: $ENVIRONMENT"
        echo "Timeout: ${TIMEOUT}s"
        echo "Retries: $RETRIES"
        echo "Output Format: $OUTPUT_FORMAT"
        echo
    fi
}

# Check individual service health
check_service_health() {
    local service_name=$1
    local endpoint=$2
    local attempt=1
    local success=false
    
    log "DEBUG" "Checking health of $service_name at $endpoint"
    
    while [[ $attempt -le $RETRIES && $success == false ]]; do
        local start_time=$(date +%s%N)
        local http_code
        local response_time
        local status="UNHEALTHY"
        local message=""
        
        # Perform health check
        if http_code=$(curl -s --max-time "$TIMEOUT" \
            --write-out "%{http_code}" \
            --output /tmp/health_response_$$ \
            "$endpoint" 2>/dev/null); then
            
            local end_time=$(date +%s%N)
            response_time=$(( (end_time - start_time) / 1000000 ))
            
            # Check HTTP status code
            if [[ $http_code -ge 200 && $http_code -lt 300 ]]; then
                status="HEALTHY"
                message="Service is responding normally"
                success=true
                
                # Try to parse health check response
                if [[ -f "/tmp/health_response_$$" ]]; then
                    local response_content=$(cat "/tmp/health_response_$$")
                    if echo "$response_content" | jq -e . >/dev/null 2>&1; then
                        # Parse JSON health response
                        local health_status=$(echo "$response_content" | jq -r '.status // "unknown"')
                        local health_message=$(echo "$response_content" | jq -r '.message // ""')
                        
                        if [[ "$health_status" != "healthy" && "$health_status" != "ok" ]]; then
                            status="DEGRADED"
                            message="Service reports: $health_status - $health_message"
                        fi
                    fi
                fi
            elif [[ $http_code -ge 400 && $http_code -lt 500 ]]; then
                status="DEGRADED"
                message="Client error (HTTP $http_code)"
            else
                status="UNHEALTHY"
                message="Server error (HTTP $http_code)"
            fi
        else
            local end_time=$(date +%s%N)
            response_time=$(( (end_time - start_time) / 1000000 ))
            status="UNHEALTHY"
            message="Connection failed or timeout"
        fi
        
        # Clean up temporary file
        rm -f "/tmp/health_response_$$"
        
        # Output result
        if [[ "$OUTPUT_FORMAT" == "json" ]]; then
            echo "{\"service\":\"$service_name\",\"endpoint\":\"$endpoint\",\"status\":\"$status\",\"response_time\":$response_time,\"http_code\":\"$http_code\",\"message\":\"$message\",\"attempt\":$attempt}"
        else
            local status_color
            case $status in
                "HEALTHY") status_color="${GREEN}" ;;
                "DEGRADED") status_color="${YELLOW}" ;;
                "UNHEALTHY") status_color="${RED}" ;;
            esac
            
            printf "%-25s %s%-10s%s %6dms %s\n" \
                "$service_name" \
                "$status_color" \
                "$status" \
                "$NC" \
                "$response_time" \
                "$message"
        fi
        
        if [[ $success == false && $attempt -lt $RETRIES ]]; then
            log "DEBUG" "Retrying $service_name health check in 2 seconds... (attempt $((attempt + 1))/$RETRIES)"
            sleep 2
        fi
        
        attempt=$((attempt + 1))
    done
    
    # Return success/failure
    if [[ $success == true ]]; then
        return 0
    else
        return 1
    fi
}

# Perform comprehensive health check
perform_health_check() {
    local overall_status="HEALTHY"
    local failed_services=()
    local degraded_services=()
    local total_services=${#ENDPOINTS[@]}
    local healthy_count=0
    local degraded_count=0
    local unhealthy_count=0
    
    if [[ "$OUTPUT_FORMAT" != "json" ]]; then
        log "INFO" "Performing health check for $total_services services..."
        echo
        printf "%-25s %-10s %8s %s\n" "SERVICE" "STATUS" "TIME" "MESSAGE"
        printf "%-25s %-10s %8s %s\n" "-------" "------" "----" "-------"
    fi
    
    # Check each service
    for service in "${!ENDPOINTS[@]}"; do
        if check_service_health "$service" "${ENDPOINTS[$service]}"; then
            healthy_count=$((healthy_count + 1))
        else
            # Determine if service is degraded or unhealthy
            local last_status=$(tail -1 /tmp/health_check_results_$$ 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            if [[ "$last_status" == "DEGRADED" ]]; then
                degraded_services+=("$service")
                degraded_count=$((degraded_count + 1))
                overall_status="DEGRADED"
            else
                failed_services+=("$service")
                unhealthy_count=$((unhealthy_count + 1))
                overall_status="UNHEALTHY"
            fi
        fi
    done
    
    # Summary
    if [[ "$OUTPUT_FORMAT" != "json" ]]; then
        echo
        log "INFO" "Health Check Summary:"
        log "INFO" "  Total Services: $total_services"
        log "INFO" "  Healthy: $healthy_count"
        log "INFO" "  Degraded: $degraded_count"
        log "INFO" "  Unhealthy: $unhealthy_count"
        log "INFO" "  Overall Status: $overall_status"
        
        if [[ ${#failed_services[@]} -gt 0 ]]; then
            log "ERROR" "Failed services: ${failed_services[*]}"
        fi
        
        if [[ ${#degraded_services[@]} -gt 0 ]]; then
            log "WARNING" "Degraded services: ${degraded_services[*]}"
        fi
    else
        echo "{\"summary\":{\"total\":$total_services,\"healthy\":$healthy_count,\"degraded\":$degraded_count,\"unhealthy\":$unhealthy_count,\"overall_status\":\"$overall_status\",\"failed_services\":[$(printf '"%s",' "${failed_services[@]}" | sed 's/,$//')],"degraded_services\":[$(printf '"%s",' "${degraded_services[@]}" | sed 's/,$//')]}}}"
    fi
    
    # Return exit code based on overall status
    case $overall_status in
        "HEALTHY") return 0 ;;
        "DEGRADED") return 1 ;;
        "UNHEALTHY") return 2 ;;
    esac
}

# Get system metrics
get_system_metrics() {
    log "INFO" "Collecting system metrics..."
    
    if command -v docker >/dev/null 2>&1; then
        echo "=== Docker Container Status ==="
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
        echo
        
        echo "=== Docker Resource Usage ==="
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null || echo "No container stats available"
        echo
    fi
    
    if command -v kubectl >/dev/null 2>&1; then
        echo "=== Kubernetes Pod Status ==="
        kubectl get pods -n coffee-export 2>/dev/null || echo "No Kubernetes cluster access"
        echo
        
        echo "=== Kubernetes Service Status ==="
        kubectl get services -n coffee-export 2>/dev/null || echo "No Kubernetes services found"
        echo
    fi
    
    echo "=== System Resources ==="
    if command -v free >/dev/null 2>&1; then
        free -h
    fi
    echo
    
    if command -v df >/dev/null 2>&1; then
        df -h / 2>/dev/null
    fi
    echo
}

# Generate health report
generate_health_report() {
    local report_file="health-report-$(date +%Y%m%d-%H%M%S).md"
    
    log "INFO" "Generating comprehensive health report: $report_file"
    
    cat > "$report_file" << EOF
# Coffee Export Platform Health Report

**Generated:** $(date)
**Environment:** $ENVIRONMENT
**Reporter:** $SCRIPT_NAME v$SCRIPT_VERSION

## Executive Summary

EOF
    
    # Perform health check and capture results
    local temp_output=$(mktemp)
    OUTPUT_FORMAT="console" perform_health_check > "$temp_output" 2>&1
    local health_status=$?
    
    case $health_status in
        0) echo "✅ **Overall Status: HEALTHY** - All systems operational" >> "$report_file" ;;
        1) echo "⚠️ **Overall Status: DEGRADED** - Some services experiencing issues" >> "$report_file" ;;
        2) echo "❌ **Overall Status: UNHEALTHY** - Critical services down" >> "$report_file" ;;
    esac
    
    cat >> "$report_file" << EOF

## Service Health Details

\`\`\`
$(cat "$temp_output")
\`\`\`

## System Metrics

\`\`\`
$(get_system_metrics)
\`\`\`

## Recommendations

EOF
    
    # Add recommendations based on health status
    if [[ $health_status -eq 2 ]]; then
        cat >> "$report_file" << EOF
- **Immediate Action Required:** Critical services are down
- Investigate failed services and restore functionality
- Check logs for error details
- Consider rollback if recent deployment caused issues
EOF
    elif [[ $health_status -eq 1 ]]; then
        cat >> "$report_file" << EOF
- **Monitor Closely:** Some services are degraded
- Review degraded services for potential issues
- Check resource utilization and scaling needs
- Plan maintenance windows for affected services
EOF
    else
        cat >> "$report_file" << EOF
- **System Healthy:** Continue regular monitoring
- Review performance metrics for optimization opportunities
- Ensure backup and disaster recovery procedures are current
- Plan for regular health check automation
EOF
    fi
    
    cat >> "$report_file" << EOF

## Next Steps

1. Review this report with the operations team
2. Address any identified issues
3. Update monitoring and alerting rules as needed
4. Schedule regular health check reviews

---
*Report generated by $SCRIPT_NAME v$SCRIPT_VERSION*
EOF
    
    rm -f "$temp_output"
    log "SUCCESS" "Health report generated: $report_file"
}

# Continuous monitoring mode
continuous_monitoring() {
    log "INFO" "Starting continuous monitoring mode (interval: ${INTERVAL}s)"
    log "INFO" "Press Ctrl+C to stop monitoring"
    
    while true; do
        local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        
        if [[ "$OUTPUT_FORMAT" == "json" ]]; then
            echo "{\"timestamp\":\"$timestamp\",\"check_type\":\"periodic\",\"environment\":\"$ENVIRONMENT\"}"
        else
            echo
            echo "=== Health Check at $timestamp ==="
        fi
        
        perform_health_check
        
        if [[ "$OUTPUT_FORMAT" != "json" ]]; then
            echo "Next check in ${INTERVAL} seconds..."
        fi
        
        sleep "$INTERVAL"
    done
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -t|--timeout)
                TIMEOUT="$2"
                shift 2
                ;;
            -r|--retries)
                RETRIES="$2"
                shift 2
                ;;
            -i|--interval)
                INTERVAL="$2"
                shift 2
                ;;
            -f|--format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            -c|--continuous)
                CONTINUOUS_MODE="true"
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
            check|monitor|status|metrics|alerts|report)
                COMMAND="$1"
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

# Main execution function
main() {
    local command="${COMMAND:-check}"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Update endpoints for selected environment
    case $ENVIRONMENT in
        "development"|"staging"|"production")
            # Endpoints already set above
            ;;
        *)
            log "ERROR" "Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    # Print header (except for JSON output)
    if [[ "$OUTPUT_FORMAT" != "json" ]]; then
        print_header
    fi
    
    # Execute command
    case $command in
        "check")
            if [[ "$CONTINUOUS_MODE" == "true" ]]; then
                continuous_monitoring
            else
                perform_health_check
            fi
            ;;
        "monitor")
            continuous_monitoring
            ;;
        "status")
            perform_health_check
            ;;
        "metrics")
            get_system_metrics
            ;;
        "report")
            generate_health_report
            ;;
        *)
            log "ERROR" "Unknown command: $command"
            print_usage
            exit 1
            ;;
    esac
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi