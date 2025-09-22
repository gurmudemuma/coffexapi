#!/usr/bin/env pwsh

Write-Host "Testing API Gateway Status..."

try {
    # Test health endpoint
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 10
    Write-Host "Health Status: $($health.status)"
    
    # Test national-bank pending approvals
    $nationalBank = Invoke-RestMethod -Uri "http://localhost:8000/api/approval-channels/pending?org=national-bank" -Method GET -Headers @{"X-User-Role"="APPROVER"; "X-Organization"="national-bank"; "Content-Type"="application/json"} -TimeoutSec 10
    Write-Host "National Bank Pending Approvals: $($nationalBank.count)"
    
    # Test if EXP-2024-001 is still in the list (should be removed after approval)
    $exp001Present = $nationalBank.pendingApprovals | Where-Object { $_.exportId -eq "EXP-2024-001" }
    if ($exp001Present) {
        Write-Host "❌ EXP-2024-001 is still in pending list (should be removed after approval)"
    } else {
        Write-Host "✅ EXP-2024-001 has been removed from pending list (approval working correctly)"
    }
    
} catch {
    Write-Host "❌ Error testing API: $($_.Exception.Message)"
}