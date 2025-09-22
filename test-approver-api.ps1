# Test Approver API Endpoints
Write-Host "Testing Approver API Endpoints..." -ForegroundColor Green

# Test endpoints for each organization
$organizations = @("national-bank", "exporter-bank", "coffee-authority", "customs")

foreach ($org in $organizations) {
    Write-Host "`nTesting $org..." -ForegroundColor Yellow
    
    try {
        $url = "http://localhost:8000/api/approval-channels/pending?org=$org"
        Write-Host "URL: $url" -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri $url -Method GET -Headers @{
            'X-User-Role' = 'APPROVER'
            'X-Organization' = $org
            'Content-Type' = 'application/json'
        }
        
        Write-Host "✅ Response received for $org" -ForegroundColor Green
        Write-Host "Pending approvals: $($response.pendingApprovals.Count)" -ForegroundColor Green
        
        if ($response.pendingApprovals.Count -gt 0) {
            $firstApproval = $response.pendingApprovals[0]
            Write-Host "Sample approval data:" -ForegroundColor Cyan
            Write-Host "  - Export ID: $($firstApproval.exportId)" -ForegroundColor White
            Write-Host "  - Exporter: $($firstApproval.exporterName)" -ForegroundColor White
            Write-Host "  - Document Type: $($firstApproval.docType)" -ForegroundColor White
            Write-Host "  - Has IPFS CID: $($firstApproval.ipfsCid -ne $null)" -ForegroundColor White
            Write-Host "  - Has Encryption Key: $($firstApproval.key -ne $null)" -ForegroundColor White
            Write-Host "  - Is Encrypted: $($firstApproval.encrypted)" -ForegroundColor White
            Write-Host "  - Document Size: $($firstApproval.size) bytes" -ForegroundColor White
        }
        
    } catch {
        Write-Host "❌ Failed to fetch data for $org" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "If you see pending approvals above, the enhanced approver panel should display them properly." -ForegroundColor Yellow