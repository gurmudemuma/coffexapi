@echo off
echo Testing IPFS CORS fix...

echo.
echo Step 1: Configuring IPFS CORS...
call configure-ipfs-cors.bat

echo.
echo Step 2: Testing direct IPFS API access...
curl -X POST -F "file=@README.md" "http://localhost:5001/api/v0/add?stream-channels=true&progress=false"

echo.
echo Step 3: Testing API Gateway IPFS proxy...
curl -X POST -F "file=@README.md" "http://localhost:8000/api/ipfs/add?stream-channels=true&progress=false"

echo.
echo If both tests work, your IPFS upload should now function properly!
pause