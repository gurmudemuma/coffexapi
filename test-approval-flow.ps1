#!/usr/bin/env pwsh

Write-Host "=== Testing Approval Flow ===" -ForegroundColor Green

# Function to make API calls with timeout
function Invoke-APICall {
    param($Uri, $Method = "GET", $Body = $null, $Headers = @{})
    
    try {
        if ($Body) {
            return Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -Headers $Headers -TimeoutSec 5
        } else {
            return Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers -TimeoutSec 5
        }
    } catch {
        Write-Host "API Call failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Step 1: Check initial pending approvals
Write-Host "`n1. Checking initial pending approvals for national-bank..." -ForegroundColor Yellow
$headers = @{
    "X-User-Role" = "APPROVER"
    "X-Organization" = "national-bank"
    "Content-Type" = "application/json"
}

$initialPending = Invoke-APICall -Uri "http://localhost:8000/api/approval-channels/pending?org=national-bank" -Headers $headers
if ($initialPending) {
    Write-Host "   Initial pending count: $($initialPending.count)" -ForegroundColor Cyan
    $initialPending.pendingApprovals | ForEach-Object {
        Write-Host "   - Export: $($_.exportId), Hash: $($_.documentHash)" -ForegroundColor Gray
    }
} else {
    Write-Host "   Failed to get initial pending approvals" -ForegroundColor Red
    exit 1
}

# Step 2: Test approval submission
if ($initialPending.pendingApprovals.Count -gt 0) {
    $testApproval = $initialPending.pendingApprovals[0]
    Write-Host "`n2. Testing approval for Export: $($testApproval.exportId)..." -ForegroundColor Yellow
    
    $approvalBody = @{
        documentHash = $testApproval.documentHash
        exportId = $testApproval.exportId
        action = "APPROVED"
        comments = "Test approval via PowerShell"
        reviewedBy = "Test Officer PowerShell"
    } | ConvertTo-Json
    
    $approvalHeaders = @{
        "Content-Type" = "application/json"
        "X-User-Role" = "APPROVER"
        "X-Organization" = "national-bank"
    }
    
    $approvalResult = Invoke-APICall -Uri "http://localhost:8000/approve" -Method "POST" -Body $approvalBody -Headers $approvalHeaders
    if ($approvalResult -and $approvalResult.success) {
        Write-Host "   ✅ Approval successful: $($approvalResult.message)" -ForegroundColor Green
        Write-Host "   Approval ID: $($approvalResult.approvalId)" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Approval failed" -ForegroundColor Red
        if ($approvalResult) {
            Write-Host "   Error: $($approvalResult.message)" -ForegroundColor Red
        }
    }
    
    # Step 3: Check if pending list updated
    Write-Host "`n3. Checking if pending list updated..." -ForegroundColor Yellow
    Start-Sleep 2  # Give server time to process
    
    $updatedPending = Invoke-APICall -Uri "http://localhost:8000/api/approval-channels/pending?org=national-bank" -Headers $headers
    if ($updatedPending) {
        Write-Host "   Updated pending count: $($updatedPending.count)" -ForegroundColor Cyan
        
        $stillPresent = $updatedPending.pendingApprovals | Where-Object { $_.exportId -eq $testApproval.exportId -and $_.documentHash -eq $testApproval.documentHash }
        if ($stillPresent) {
            Write-Host "   ❌ Document still in pending list - approval not working correctly" -ForegroundColor Red
        } else {
            Write-Host "   ✅ Document removed from pending list - approval working correctly" -ForegroundColor Green
        }
    } else {
        Write-Host "   Failed to get updated pending approvals" -ForegroundColor Red
    }
} else {
    Write-Host "`n2. No pending approvals to test" -ForegroundColor Yellow
}

# Step 4: Test rejection with another document
if ($initialPending.pendingApprovals.Count -gt 1) {
    $testRejection = $initialPending.pendingApprovals[1]
    Write-Host "`n4. Testing rejection for Export: $($testRejection.exportId)..." -ForegroundColor Yellow
    
    $rejectionBody = @{
        documentHash = $testRejection.documentHash
        exportId = $testRejection.exportId
        action = "REJECTED"
        comments = "Test rejection - document does not meet requirements"
        reviewedBy = "Test Officer PowerShell"
    } | ConvertTo-Json
    
    $rejectionResult = Invoke-APICall -Uri "http://localhost:8000/approve" -Method "POST" -Body $rejectionBody -Headers $approvalHeaders
    if ($rejectionResult -and $rejectionResult.success) {
        Write-Host "   ✅ Rejection successful: $($rejectionResult.message)" -ForegroundColor Green
        Write-Host "   Rejection ID: $($rejectionResult.approvalId)" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Rejection failed" -ForegroundColor Red
        if ($rejectionResult) {
            Write-Host "   Error: $($rejectionResult.message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n4. Not enough pending approvals to test rejection" -ForegroundColor Yellow
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green