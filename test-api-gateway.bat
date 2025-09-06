@echo off
echo ========================================
echo API Gateway Functionality Test
echo ========================================
echo.

echo Testing API Gateway Health Endpoint...
curl -X GET http://localhost:8000/health
echo.
echo.

echo Testing API Gateway Authentication...
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{}"
echo.
echo.

echo Testing Pending Approvals Endpoint...
echo National Bank:
curl -X GET "http://localhost:8000/api/pending-approvals?org=national-bank"
echo.
echo.

echo Exporter Bank:
curl -X GET "http://localhost:8000/api/pending-approvals?org=exporter-bank"
echo.
echo.

echo Quality Authority:
curl -X GET "http://localhost:8000/api/pending-approvals?org=quality-authority"
echo.
echo.

echo Customs:
curl -X GET "http://localhost:8000/api/pending-approvals?org=customs"
echo.
echo.

echo Testing Exports List Endpoint...
curl -X GET http://localhost:8000/api/exports/list
echo.
echo.

echo ========================================
echo API Gateway Test Complete
echo ========================================
pause