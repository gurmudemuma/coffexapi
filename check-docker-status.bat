@echo off
echo ========================================
echo Docker Container Status Check
echo ========================================
echo.

echo Checking if Docker is running...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running or not installed
    pause
    exit /b 1
)
echo Docker is running ✓
echo.

echo ========================================
echo Coffee Export Platform Containers
echo ========================================
echo.

echo API Gateway:
docker ps --filter "name=api-gateway" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "API Gateway container not found"
echo.

echo Blockchain Network:
echo ---- Orderer ----
docker ps --filter "name=orderer.coffee-consortium.com" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "Orderer not found"
echo.

echo ---- Peers ----
docker ps --filter "name=peer0.nationalbank.com" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "National Bank peer not found"
docker ps --filter "name=peer0.exporterbank.com" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "Exporter Bank peer not found" 
docker ps --filter "name=peer0.coffeeauthority.com" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "Coffee Authority peer not found"
docker ps --filter "name=peer0.customs.com" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "Customs peer not found"
echo.

echo ---- CouchDB Databases ----
docker ps --filter "name=couchdb" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No CouchDB containers found"
echo.

echo Validator Services:
docker ps --filter "name=validator" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No validator containers found"
echo.

echo IPFS Service:
docker ps --filter "name=ipfs" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "IPFS container not found"
echo.

echo ========================================
echo All Running Containers
echo ========================================
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ========================================
echo Container Status Check Complete
echo ========================================
pause