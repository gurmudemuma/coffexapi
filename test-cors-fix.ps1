#!/usr/bin/env pwsh

Write-Host "Testing CORS fix for IPFS upload..." -ForegroundColor Green

# Test 1: Check API Gateway CORS headers
Write-Host "`n1. Testing API Gateway CORS headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/ipfs/add" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    } -UseBasicParsing

    Write-Host "✅ OPTIONS request successful" -ForegroundColor Green
    Write-Host "Response headers:" -ForegroundColor Cyan
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ OPTIONS request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Check for duplicate CORS headers in actual upload
Write-Host "`n2. Testing actual file upload for CORS issues..." -ForegroundColor Yellow

# Create a test file
$testContent = "Test file for CORS validation"
$testFile = "test-cors-file.txt"
Set-Content -Path $testFile -Value $testContent

try {
    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$testFile`"",
        "Content-Type: text/plain$LF",
        $testContent,
        "--$boundary--$LF"
    ) -join $LF
    
    $body = [System.Text.Encoding]::UTF8.GetBytes($bodyLines)
    
    $headers = @{
        "Content-Type" = "multipart/form-data; boundary=$boundary"
        "Origin" = "http://localhost:3000"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/ipfs/add" -Method POST -Body $body -Headers $headers -UseBasicParsing
    
    Write-Host "✅ File upload successful" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor White
    
    # Check for duplicate CORS headers
    $corsHeaders = $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" }
    if ($corsHeaders) {
        Write-Host "CORS headers in response:" -ForegroundColor Cyan
        $corsHeaders | ForEach-Object {
            $headerValues = $_.Value
            if ($headerValues -is [array] -and $headerValues.Count -gt 1) {
                Write-Host "  ⚠️  $($_.Key): Multiple values detected - $($headerValues -join ', ')" -ForegroundColor Yellow
            } else {
                Write-Host "  ✅ $($_.Key): $($_.Value)" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "⚠️  No CORS headers found in response" -ForegroundColor Yellow
    }
    
    # Parse response to check if IPFS upload was successful
    $responseContent = $response.Content
    Write-Host "Response content: $responseContent" -ForegroundColor White
    
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*Multiple CORS header*") {
        Write-Host "❌ CORS error still present: $errorMessage" -ForegroundColor Red
        Write-Host "   The fix may not have been applied correctly." -ForegroundColor Red
    } else {
        Write-Host "❌ Upload failed: $errorMessage" -ForegroundColor Red
    }
}

# Cleanup
if (Test-Path $testFile) {
    Remove-Item $testFile -Force
}

Write-Host "`n3. Recommendations:" -ForegroundColor Yellow
Write-Host "   - Restart your API Gateway after making the code changes" -ForegroundColor White
Write-Host "   - Run the updated configure-ipfs-cors.bat to remove IPFS CORS headers" -ForegroundColor White
Write-Host "   - Ensure only the API Gateway is setting CORS headers" -ForegroundColor White

Write-Host "`nCORS fix test completed!" -ForegroundColor Green