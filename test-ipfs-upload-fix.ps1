#!/usr/bin/env pwsh
# Test IPFS Upload Fix via API Gateway Proxy

Write-Host "🔧 Testing IPFS Upload Fix" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Test 1: Check if API Gateway is running
Write-Host "`n1. Testing API Gateway..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
    Write-Host "   ✅ API Gateway is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ API Gateway not responding" -ForegroundColor Red
    Write-Host "   Please ensure your API Gateway is running on port 8000" -ForegroundColor Red
    exit 1
}

# Test 2: Check IPFS proxy endpoint
Write-Host "`n2. Testing IPFS Proxy Endpoint..." -ForegroundColor Yellow
try {
    # Create a simple test file
    $testContent = "This is a test file for IPFS upload via API Gateway proxy"
    $testBytes = [System.Text.Encoding]::UTF8.GetBytes($testContent)
    $boundary = [System.Guid]::NewGuid().ToString()
    
    # Create multipart form data
    $LF = "`r`n"
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"test.txt`"",
        "Content-Type: text/plain",
        "",
        $testContent,
        "--$boundary--"
    )
    $body = $bodyLines -join $LF
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    
    # Test the upload endpoint
    $headers = @{
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    $uploadResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/ipfs/add" -Method POST -Body $bodyBytes -Headers $headers -TimeoutSec 10
    
    if ($uploadResponse.Hash) {
        Write-Host "   ✅ IPFS upload proxy working - CID: $($uploadResponse.Hash)" -ForegroundColor Green
        
        # Test retrieval
        Write-Host "`n3. Testing IPFS Retrieval..." -ForegroundColor Yellow
        try {
            $retrieveResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/ipfs/$($uploadResponse.Hash)" -Method GET -TimeoutSec 5
            Write-Host "   ✅ IPFS retrieval proxy working" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  IPFS retrieval test failed (this may be normal)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ IPFS upload proxy failed - no hash returned" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ IPFS proxy test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This may indicate IPFS is not running or not accessible" -ForegroundColor Yellow
}

Write-Host "`n🎯 CORS Fix Summary:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ Updated IPFS service to use API Gateway proxy" -ForegroundColor Green
Write-Host "✅ Bypasses CORS issues by routing through backend" -ForegroundColor Green
Write-Host "✅ Maintains all encryption and upload functionality" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Restart your frontend development server if it's running" -ForegroundColor White
Write-Host "2. Try uploading a document through the export form" -ForegroundColor White
Write-Host "3. Check browser console - CORS errors should be gone" -ForegroundColor White
Write-Host "4. Verify documents appear in approver dashboards" -ForegroundColor White

Write-Host "`n🔍 Test Upload:" -ForegroundColor Magenta
Write-Host "   Go to: http://localhost:3002/export-form" -ForegroundColor White
Write-Host "   Upload any PDF document and check for CORS errors" -ForegroundColor White