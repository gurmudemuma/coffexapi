# Coffee Export Platform - Unified Deployment Guide

## 🎯 Overview

This document provides comprehensive guidance for deploying the Coffee Export Platform using the unified deployment orchestration system. The system supports multiple environments, deployment modes, and provides extensive monitoring and health checking capabilities.

## 🏗️ Deployment Architecture

### System Components

The Coffee Export Platform consists of the following key components:

1. **Blockchain Network**
   - Hyperledger Fabric orderer and peer nodes
   - CouchDB state databases
   - Chaincode (smart contracts)

2. **Validator Services**
   - National Bank License Validator
   - Quality Authority Validator
   - Customs Shipping Validator
   - Bank API Validator

3. **Core Services**
   - API Gateway (Go-based)
   - Frontend Application (React/TypeScript)
   - IPFS for document storage

4. **Infrastructure Services**
   - MongoDB (development)
   - Redis (caching)
   - Nginx (load balancing)
   - Monitoring stack (Prometheus, Grafana)

### Deployment Environments

| Environment | Purpose | URL | Configuration |
|-------------|---------|-----|---------------|
| **Development** | Local development and testing | http://localhost:3000 | Hot reload, debug mode |
| **Staging** | Pre-production testing | https://staging.coffee-export.com | Production-like setup |
| **Production** | Live production system | https://app.coffee-export.com | High availability, monitoring |

## 🚀 Quick Start

### Prerequisites

Before deploying, ensure you have the following tools installed:

```bash
# Required tools
- Docker (20.10+)
- Docker Compose (2.0+)
- Node.js (18.x or 20.x)
- npm (9.x+)

# Production deployment additional requirements
- kubectl (1.28+)
- Helm (3.12+)
- Git
```

### Basic Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/coffee-export-platform.git
   cd coffee-export-platform
   ```

2. **Deploy to development environment:**
   ```bash
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

3. **Verify deployment:**
   ```bash
   ./deploy/health-check.sh
   ```

## 📋 Deployment Commands

### Main Deployment Script: `deploy/deploy.sh`

#### Full Deployment
```bash
# Deploy everything to development (default)
./deploy/deploy.sh

# Deploy to specific environment
./deploy/deploy.sh --environment production

# Deploy with verbose logging
./deploy/deploy.sh --verbose
```

#### Selective Deployment
```bash
# Deploy only blockchain network
./deploy/deploy.sh --mode blockchain

# Deploy only validator services
./deploy/deploy.sh --mode services

# Deploy only frontend
./deploy/deploy.sh --mode frontend

# Deploy only monitoring stack
./deploy/deploy.sh --mode monitoring
```

#### Advanced Options
```bash
# Dry run (show what would be deployed)
./deploy/deploy.sh --dry-run --verbose

# Skip tests and health checks
./deploy/deploy.sh --skip-tests --skip-health-checks

# Custom timeout
./deploy/deploy.sh --timeout 600
```

#### Utility Commands
```bash
# Show deployment status
./deploy/deploy.sh status

# View deployment logs
./deploy/deploy.sh logs

# Clean up all resources
./deploy/deploy.sh cleanup

# Run deployment tests
./deploy/deploy.sh test
```

### Health Monitoring: `deploy/health-check.sh`

#### Basic Health Checks
```bash
# Check all services
./deploy/health-check.sh

# Check production environment
./deploy/health-check.sh --environment production

# Continuous monitoring
./deploy/health-check.sh monitor --interval 30
```

#### Advanced Monitoring
```bash
# JSON output for automation
./deploy/health-check.sh --format json

# Generate comprehensive report
./deploy/health-check.sh report

# Show system metrics
./deploy/health-check.sh metrics
```

## 🔧 Environment Configuration

### Environment Files

Each environment has its own configuration file in `deploy/environments/`:

- `development.env` - Local development settings
- `staging.env` - Staging environment settings  
- `production.env` - Production environment settings

### Key Configuration Variables

#### Common Settings
```bash
# Environment metadata
ENVIRONMENT=development
NODE_ENV=development
DEPLOY_MODE=full

# Service endpoints
API_GATEWAY_HOST=localhost
API_GATEWAY_PORT=8000
FRONTEND_HOST=localhost
FRONTEND_PORT=3000

# Database configuration
DATABASE_URL=mongodb://localhost:27017/coffee_export_dev
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=DEBUG
LOG_FORMAT=json
```

#### Production-Specific Settings
```bash
# High availability
AUTO_SCALING_ENABLED=true
MIN_REPLICAS=2
MAX_REPLICAS=10

# Security
SSL_ENABLED=true
SECURITY_HEADERS_ENABLED=true
CSRF_PROTECTION_ENABLED=true

# Monitoring
MONITORING_ENDPOINT=https://monitoring.coffee-export.com
ALERT_THRESHOLDS configured

# Backup and disaster recovery
BACKUP_ENABLED=true
DISASTER_RECOVERY_ENABLED=true
```

### Custom Configuration

To override default settings:

1. **Environment Variables:**
   ```bash
   export DEPLOY_ENV=staging
   export LOG_LEVEL=INFO
   ./deploy/deploy.sh
   ```

2. **Custom Environment File:**
   ```bash
   cp deploy/environments/production.env deploy/environments/custom.env
   # Edit custom.env
   ./deploy/deploy.sh --environment custom
   ```

## 🐳 Docker Deployment

### Development Environment

Uses `deploy/docker-compose.development.yaml`:

```bash
# Start development environment
docker-compose -f docker-compose.yaml -f deploy/docker-compose.development.yaml up -d

# Access services
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8000  
# Grafana: http://localhost:3001
```

### Production Environment

Uses `deploy/docker-compose.production.yaml`:

```bash
# Start production environment
docker-compose -f docker-compose.yaml -f deploy/docker-compose.production.yaml up -d

# Services include:
# - Nginx load balancer
# - Multiple service replicas
# - Full monitoring stack
# - Backup services
```

### Building Custom Images

```bash
# Build all services
./build-services.sh

# Build specific service
docker build -f api-gateway/Dockerfile -t api-gateway:custom .
```

## ☸️ Kubernetes Deployment

### Prerequisites

```bash
# Ensure kubectl is configured
kubectl cluster-info

# Install cert-manager for SSL certificates
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

### Deployment Steps

1. **Deploy to Kubernetes:**
   ```bash
   # Apply all manifests
   kubectl apply -f deploy/kubernetes/coffee-export-deployment.yaml
   
   # Monitor deployment
   kubectl rollout status deployment/api-gateway -n coffee-export
   ```

2. **Configure Ingress:**
   ```bash
   # Update DNS records to point to ingress controller
   # app.coffee-export.com -> <INGRESS_IP>
   # api.coffee-export.com -> <INGRESS_IP>
   ```

3. **Verify Deployment:**
   ```bash
   kubectl get pods -n coffee-export
   kubectl get services -n coffee-export
   kubectl get ingress -n coffee-export
   ```

### Scaling

```bash
# Manual scaling
kubectl scale deployment api-gateway --replicas=5 -n coffee-export

# Auto-scaling is configured via HPA
kubectl get hpa -n coffee-export
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline (`.github/workflows/ci-cd.yml`) provides:

- **Automated Testing:** Lint, unit tests, security scans
- **Image Building:** Multi-stage Docker builds
- **Environment Deployment:** Automatic deployment to environments
- **Health Checks:** Post-deployment validation
- **Notifications:** Slack notifications for deployment status

### Pipeline Triggers

| Trigger | Environment | Actions |
|---------|-------------|---------|
| Push to `develop` | Development | Build, test, deploy |
| Push to `staging` | Staging | Build, test, deploy, integration tests |
| Release creation | Production | Build, test, deploy to K8s, smoke tests |
| Pull request | None | Build, test only |

### Required Secrets

Configure these secrets in your GitHub repository:

```bash
# Container registry
GITHUB_TOKEN

# Environment configurations
STAGING_DATABASE_URL
STAGING_JWT_SECRET
PROD_DATABASE_URL
PROD_JWT_SECRET

# Kubernetes access
KUBE_CONFIG

# Monitoring
METRICS_ENDPOINT
METRICS_TOKEN

# Notifications
SLACK_WEBHOOK
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints

Each service provides health check endpoints:

| Service | Development | Production |
|---------|-------------|------------|
| API Gateway | http://localhost:8000/health | https://api.coffee-export.com/health |
| Frontend | http://localhost:3000 | https://app.coffee-export.com |
| Validators | http://localhost:808X/health | https://validator.coffee-export.com/health |

### Monitoring Stack

#### Prometheus Metrics
- **Endpoint:** http://localhost:9090
- **Metrics:** HTTP requests, response times, error rates
- **Alerts:** CPU, memory, disk usage thresholds

#### Grafana Dashboards
- **Endpoint:** http://localhost:3001
- **Dashboards:** System overview, service health, business metrics
- **Alerts:** Integration with Prometheus alerting

#### Log Aggregation
- **Development:** Console logs with structured JSON
- **Production:** ELK stack (Elasticsearch, Logstash, Kibana)
- **Retention:** 30 days development, 90 days production

### Health Check Automation

```bash
# Continuous monitoring
./deploy/health-check.sh monitor --interval 60

# Automated reports
./deploy/health-check.sh report > daily-health-report.md

# Integration with monitoring
./deploy/health-check.sh --format prometheus > /var/lib/prometheus/health-metrics.prom
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Services Not Starting
```bash
# Check container logs
docker logs <container_name>

# Check resource usage
docker stats

# Verify network connectivity
docker network ls
```

#### 2. Health Check Failures
```bash
# Check service status
./deploy/health-check.sh --verbose

# Check individual service
curl -v http://localhost:8000/health

# Check logs for errors
./deploy/deploy.sh logs api-gateway
```

#### 3. Blockchain Network Issues
```bash
# Check peer status
docker exec cli peer channel list

# Check chaincode status
docker exec cli peer chaincode list --installed

# Regenerate crypto materials
./network/scripts/organizations/generate_crypto.sh
```

#### 4. Frontend Build Issues
```bash
# Clear cache and rebuild
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Mode

Enable debug mode for detailed troubleshooting:

```bash
# Deployment debug
./deploy/deploy.sh --verbose --dry-run

# Health check debug
./deploy/health-check.sh --verbose

# Container debug
docker-compose logs -f <service_name>
```

### Log Analysis

```bash
# View deployment logs
tail -f logs/deployment-*.log

# Search for errors
grep -i error logs/deployment-*.log

# Filter by service
grep "api-gateway" logs/deployment-*.log
```

## 🔒 Security Considerations

### Development Environment
- Default credentials for databases
- HTTP-only communication
- Debug mode enabled
- Mock validators available

### Production Environment
- Strong passwords and certificates required
- HTTPS-only communication
- Security headers enabled
- Real validator integrations
- Network policies in Kubernetes
- Regular security scans

### Security Checklist

- [ ] Strong passwords for all services
- [ ] SSL/TLS certificates configured
- [ ] Security headers enabled
- [ ] Network policies applied
- [ ] Container images scanned for vulnerabilities
- [ ] Access controls configured
- [ ] Audit logging enabled
- [ ] Backup encryption configured

## 📈 Performance Optimization

### Resource Allocation

#### Development
```yaml
api-gateway:
  memory: 256Mi
  cpu: 100m

frontend:
  memory: 128Mi
  cpu: 50m
```

#### Production
```yaml
api-gateway:
  memory: 1Gi
  cpu: 500m
  replicas: 3

frontend:
  memory: 512Mi
  cpu: 250m
  replicas: 3
```

### Scaling Guidelines

1. **Monitor resource usage** before scaling
2. **Scale horizontally** for stateless services
3. **Use auto-scaling** in production
4. **Monitor response times** after scaling
5. **Update resource requests/limits** based on usage

### Performance Monitoring

```bash
# Resource usage
kubectl top pods -n coffee-export

# Application metrics
curl http://localhost:8000/metrics

# Load testing
k6 run deploy/tests/performance-test.js
```

## 🔄 Backup and Recovery

### Automated Backups

Production environment includes automated backup:

```bash
# Database backups (daily)
# Log backups (weekly)  
# Configuration backups (on change)
# Certificate backups (monthly)
```

### Manual Backup

```bash
# Database backup
docker exec mongodb mongodump --out=/backup

# Configuration backup
tar -czf config-backup.tar.gz deploy/environments/

# Container volumes backup
docker run --rm -v coffee_data:/data -v $(pwd):/backup ubuntu tar czf /backup/volumes-backup.tar.gz /data
```

### Disaster Recovery

1. **Restore from backup:**
   ```bash
   # Restore database
   docker exec mongodb mongorestore /backup
   
   # Restore configuration
   tar -xzf config-backup.tar.gz
   
   # Redeploy services
   ./deploy/deploy.sh --environment production
   ```

2. **Verify recovery:**
   ```bash
   ./deploy/health-check.sh --environment production
   ```

## 📚 Additional Resources

### Documentation Files
- `README.md` - Project overview
- `CONFIGURATION_GUIDE.md` - Detailed configuration reference
- `LOGGING_AND_MONITORING_GUIDE.md` - Monitoring setup
- `FRONTEND_STANDARDIZATION_GUIDE.md` - Frontend architecture

### Script References
- `deploy/deploy.sh` - Main deployment orchestration
- `deploy/health-check.sh` - Health monitoring and checks
- `build-services.sh` - Service building automation
- `start-system.sh` - Legacy startup script

### Configuration Files
- `docker-compose.yaml` - Base Docker Compose configuration
- `deploy/docker-compose.*.yaml` - Environment-specific overrides
- `deploy/kubernetes/` - Kubernetes manifests
- `deploy/environments/` - Environment configurations

### Support and Contributing

For issues, feature requests, or contributions:

1. **GitHub Issues:** Report bugs or request features
2. **Pull Requests:** Contribute improvements
3. **Documentation:** Update guides and documentation
4. **Testing:** Add tests for new features

---

**Note:** This deployment system is designed for flexibility and scalability. Start with development environment and gradually move to production as you become familiar with the system.