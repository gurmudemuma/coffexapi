@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up Coffexapi Frontend...

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Please run this script from the frontend directory
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file...
    copy ".env.example" ".env" > nul
    echo ✅ Created .env file with default settings
) else (
    echo ✅ .env file already exists
)

REM Check if IPFS feature is enabled
findstr /c:"VITE_FEATURE_IPFS_UPLOAD=true" .env > nul
if !errorlevel! equ 0 (
    echo ✅ IPFS uploads are enabled
) else (
    echo ⚠️  IPFS uploads are disabled. Enable them by setting VITE_FEATURE_IPFS_UPLOAD=true in .env
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

REM Check if docker is running
docker info > nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo 🔍 Checking IPFS service...

REM Check if IPFS container is running
docker ps --format "table {{.Names}}" | findstr "ipfs" > nul
if !errorlevel! equ 0 (
    echo ✅ IPFS service is running
) else (
    echo ⚠️  IPFS service is not running
    echo To start IPFS service, run from the project root:
    echo   docker-compose up ipfs -d
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Start the development server: npm run dev
echo 2. Ensure IPFS is running: docker-compose up ipfs -d (from project root)
echo 3. Open http://localhost:3000 in your browser
echo.
echo If you encounter IPFS upload errors:
echo - Check that VITE_FEATURE_IPFS_UPLOAD=true in .env
echo - Ensure IPFS service is running on port 5001
echo - Verify the API endpoint is accessible at http://localhost:5001

pause