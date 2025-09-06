@echo off
echo ========================================
echo Coffee Export Platform Service Check
echo ========================================
echo.

echo Checking API Gateway (Port 8000)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8000/health 2>nul || echo "API Gateway: NOT RUNNING"
echo.

echo Checking IPFS Gateway (Port 8090)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8090 2>nul || echo "IPFS Gateway: NOT RUNNING"
echo.

echo Checking Blockchain Peers...
echo National Bank Peer (9443):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:9443/healthz 2>nul || echo "National Bank Peer: NOT RUNNING"

echo Exporter Bank Peer (9444):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:9444/healthz 2>nul || echo "Exporter Bank Peer: NOT RUNNING"

echo Coffee Authority Peer (9445):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:9445/healthz 2>nul || echo "Coffee Authority Peer: NOT RUNNING"
echo.

echo Checking Validator Services...
echo National Bank Validator (8083):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8083/health 2>nul || echo "National Bank Validator: NOT RUNNING"

echo Quality Authority Validator (8081):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8081/health 2>nul || echo "Quality Validator: NOT RUNNING"

echo Customs Validator (8082):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8082/health 2>nul || echo "Customs Validator: NOT RUNNING"
echo.

echo ========================================
echo Service Check Complete
echo ========================================
pause