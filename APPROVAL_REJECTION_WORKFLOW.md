# Approval and Rejection Workflow

## Overview
This document explains how the approval and rejection functionality works in the Coffee Export System, covering both frontend components and backend API.

## Components

### 1. Frontend Components
There are three main components that handle approvals and rejections:

1. **ApproversPanel.tsx** - Basic approval panel
2. **EnhancedApproverPanel.tsx** - Enhanced approval panel with better UI
3. **MultiChannelApproversPanel.tsx** - Multi-channel approval panel for complex workflows

### 2. Backend API
The API Gateway handles approval requests through two main endpoints:

1. `/approve` - Standard approval endpoint
2. `/api/approval-channels/submit-decision` - Multi-channel approval endpoint

## Workflow

### Approval Process
1. User clicks "Approve" button on a pending document
2. A dialog opens for adding comments (optional)
3. User clicks "Approve Document" to submit
4. Frontend sends approval request to backend API
5. Backend validates the request and stores the approval
6. Backend returns success response
7. Frontend updates UI to reflect the approval

### Rejection Process
1. User clicks "Reject" button on a pending document
2. A dialog opens requiring comments (mandatory)
3. User adds rejection reason and clicks "Reject Document"
4. Frontend sends rejection request to backend API
5. Backend validates the request and stores the rejection
6. Backend returns success response
7. Frontend updates UI to reflect the rejection

## API Endpoints

### Standard Approval Endpoint
```
POST http://localhost:8000/approve
Content-Type: application/json

{
  "documentHash": "string",
  "exportId": "string",
  "action": "APPROVED|REJECTED",
  "comments": "string",
  "reviewedBy": "string"
}
```

### Multi-Channel Approval Endpoint
```
POST http://localhost:8000/api/approval-channels/submit-decision?org=organization-type
Content-Type: application/json
X-User-Role: APPROVER|BANK_SUPERVISOR|BANK
X-Organization: organization-type

{
  "documentHash": "string",
  "exportId": "string",
  "action": "APPROVED|REJECTED",
  "comments": "string",
  "reviewedBy": "string"
}
```

## Response Format
Both endpoints return a consistent response format:

```json
{
  "success": true,
  "message": "Document approved successfully",
  "approvalId": "unique-approval-id",
  "timestamp": "ISO-8601 timestamp"
}
```

## Error Handling
The system provides comprehensive error handling:

1. **Validation Errors** - Missing required fields or invalid actions
2. **Not Found Errors** - Export or document not found in registry
3. **Network Errors** - Connection issues with the API
4. **Server Errors** - Backend processing errors

## Testing
To test the approval and rejection functionality:

1. Ensure the API Gateway is running (`go run api-gateway/main.go`)
2. Run the test script: `node test-approval-workflow.js`
3. Check browser console for frontend debugging messages
4. Verify network requests in browser developer tools

## Troubleshooting

### Common Issues
1. **API Gateway Not Running** - Start with `go run api-gateway/main.go`
2. **CORS Errors** - API Gateway includes proper CORS headers
3. **Dialog Not Opening** - Check browser console for JavaScript errors
4. **Network Errors** - Verify API Gateway is accessible at localhost:8000

### Debugging Tips
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click approval/rejection buttons
4. Look for console.log messages
5. Check Network tab for HTTP requests
6. Verify request payloads and responses