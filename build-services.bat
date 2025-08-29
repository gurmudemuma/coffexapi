@echo off
echo Building Coffee Export Platform Services...
echo.

echo Step 1: Building validator base image...
docker build -f validators/Dockerfile.base -t validator-base:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build validator base image!
    exit /b 1
)

echo Step 2: Building individual validator services...
echo Building national-bank-validator...
docker build -f validators/national-bank/Dockerfile -t national-bank-validator .

echo Building quality-authority-validator...
docker build -f validators/quality-authority/Dockerfile -t quality-authority-validator .

echo Building customs-validator...
docker build -f validators/customs/Dockerfile -t customs-validator .

echo Step 3: Building bank API service...
docker build -f validators/bank-api/Dockerfile -t bank-api-validator .

echo Step 4: Building API Gateway...
docker build -f api-gateway/Dockerfile -t api-gateway .

echo.
echo All services built successfully!
echo You can now start the services with: docker-compose up -d
pause