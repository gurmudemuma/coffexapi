#!/usr/bin/env pwsh

Write-Host "🧪 Testing Approval Button Functionality" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Test 1: Check if API Gateway is running
Write-Host "`n1. Testing API Gateway Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ API Gateway is running" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ API Gateway is not running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Check pending approvals endpoint
Write-Host "`n2. Testing Pending Approvals Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        'X-User-Role' = 'APPROVER'
        'X-Organization' = 'NATIONAL_BANK'
        'Content-Type' = 'application/json'
    }
    
    $pendingResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/approval-channels/pending?org=NATIONAL_BANK" -Method GET -Headers $headers -TimeoutSec 10
    $pendingCount = $pendingResponse.pendingApprovals.Count
    
    Write-Host "✅ Pending approvals endpoint working" -ForegroundColor Green
    Write-Host "   Found: $pendingCount pending approvals" -ForegroundColor Gray
    
    if ($pendingCount -gt 0) {
        $firstApproval = $pendingResponse.pendingApprovals[0]
        Write-Host "   Sample: $($firstApproval.exportId) - $($firstApproval.documentType)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Pending approvals endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test approval endpoint
Write-Host "`n3. Testing Approval Endpoint..." -ForegroundColor Yellow
try {
    $approvalBody = @{
        documentHash = "test-hash-123"
        exportId = "EXP-TEST-001"
        action = "APPROVED"
        comments = "Test approval from PowerShell script"
        reviewedBy = "Test Officer"
        organization = "NATIONAL_BANK"
        documentType = "license"
    } | ConvertTo-Json
    
    $approvalResponse = Invoke-RestMethod -Uri "http://localhost:8000/approve" -Method POST -Headers $headers -Body $approvalBody -TimeoutSec 10
    
    Write-Host "✅ Approval endpoint working" -ForegroundColor Green
    Write-Host "   Response: $($approvalResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Approval endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check summary endpoint
Write-Host "`n4. Testing Summary Endpoint..." -ForegroundColor Yellow
try {
    $summaryResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/approval-channels/summary?org=NATIONAL_BANK" -Method GET -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Summary endpoint working" -ForegroundColor Green
    Write-Host "   Pending: $($summaryResponse.pending)" -ForegroundColor Gray
    Write-Host "   Approved: $($summaryResponse.approved)" -ForegroundColor Gray
    Write-Host "   Rejected: $($summaryResponse.rejected)" -ForegroundColor Gray
    Write-Host "   Urgent: $($summaryResponse.urgent)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Summary endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Frontend Debugging Tips:" -ForegroundColor Cyan
Write-Host "1. Open browser developer tools (F12)" -ForegroundColor White
Write-Host "2. Go to Console tab" -ForegroundColor White
Write-Host "3. Click the Approve button" -ForegroundColor White
Write-Host "4. Look for console.log messages:" -ForegroundColor White
Write-Host "   - 'Approve dialog trigger clicked for: ...' " -ForegroundColor Gray
Write-Host "   - 'Dialog should be opening, approveDialogOpen set to true'" -ForegroundColor Gray
Write-Host "   - 'Approve button clicked, reviewingDocument: ...' " -ForegroundColor Gray
Write-Host "   - 'Submitting approval for: ...' " -ForegroundColor Gray
Write-Host "5. Check Network tab for HTTP requests to /approve endpoint" -ForegroundColor White

Write-Host "`n✅ API Backend Tests Complete!" -ForegroundColor Green