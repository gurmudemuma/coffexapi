@echo off
echo Removing IPFS CORS settings to prevent conflicts with API Gateway...

REM Check if IPFS container is running
docker ps | find "ipfs" >nul
if errorlevel 1 (
    echo Starting IPFS container...
    docker-compose up -d ipfs
    timeout /t 10 /nobreak >nul
)

REM Remove CORS settings from IPFS API (API Gateway will handle CORS)
echo Removing CORS configuration from IPFS...
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "null"
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "null"
docker exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers "null"

REM Restart IPFS to apply changes
echo Restarting IPFS to apply configuration changes...
docker-compose restart ipfs

REM Wait for IPFS to be ready
echo Waiting for IPFS to be ready...
timeout /t 15 /nobreak >nul

REM Test IPFS API
echo Testing IPFS API...
curl -s http://localhost:5001/api/v0/version >nul 2>&1
if errorlevel 1 (
    echo ❌ IPFS API is not accessible
) else (
    echo ✅ IPFS API is accessible at http://localhost:5001
    echo ✅ CORS headers removed - API Gateway will handle CORS
)

echo IPFS CORS configuration complete!
pause