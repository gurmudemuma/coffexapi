@echo off
echo Testing CORS headers for Coffee Export Platform services...
echo.

echo Testing API Gateway CORS:
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8000/api/pending-approvals
echo.

echo Testing National Bank validator CORS:
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8083/approve
echo.

echo Testing Quality Authority validator CORS:
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8081/approve
echo.

echo Testing Customs validator CORS:
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8082/approve
echo.

echo CORS testing complete!
pause