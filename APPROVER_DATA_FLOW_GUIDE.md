# 📋 Approver Data Flow Guide

## Overview: How Approvers See Submitted Documents

This guide explains the complete workflow of how export documents submitted by exporters become visible to approvers for validation and approval.

## 🔄 Complete Data Flow

### **1. Exporter Submission Process**

When an exporter submits documents through the Coffee Export System:

1. **Frontend Form Submission** (`ExportForm.tsx`)
   - Exporter fills out company details, trade information, and uploads documents
   - Documents are uploaded to IPFS for decentralized storage
   - Form data is submitted to API Gateway

2. **API Gateway Processing** (`/api/exports` endpoint)
   - Receives export request from frontend
   - Calls blockchain smart contract `SubmitExport` function
   - Export data is stored on the blockchain

3. **Blockchain Event Emission**
   - Smart contract emits `validate_document` events for each document type
   - Events contain: `exportId`, `docType`, `hash`, and metadata

4. **Event-Driven Notification**
   - API Gateway listens for blockchain events
   - Validation workers process events and route to appropriate validator services
   - Each organization receives notifications for their document types

### **2. Approver Interface Access**

Approvers access the system through organization-specific dashboards:

#### **🏛️ Organization Types & Responsibilities**

| Organization | Document Type | Port | Endpoint |
|-------------|---------------|------|----------|
| National Bank | LICENSE | 8080 | `http://localhost:8080` |
| Exporter Bank | INVOICE | 5000 | `http://localhost:5000` |
| Coffee Quality Authority | QUALITY | 8081 | `http://localhost:8081` |
| Customs Authority | SHIPPING | 8082 | `http://localhost:8082` |

#### **🎯 Approver Dashboard Features**

The `ApproversPanel` component provides:

- **Organization Selection**: Choose the approving organization type
- **Pending Queue**: Documents awaiting review
- **Completed Reviews**: Historical approval decisions
- **Real-time Updates**: Polls every 30 seconds for new submissions
- **Document Review Interface**: Modal for detailed examination and decision making

### **3. Data Sources for Approvers**

#### **📡 API Endpoints**

Approvers see data through these API calls:

```typescript
// Fetch pending approvals for organization
GET http://localhost:8000/api/pending-approvals?org=${organizationType}

// Fetch completed approvals for organization  
GET http://localhost:8000/api/completed-approvals?org=${organizationType}

// Submit approval/rejection decision
POST http://localhost:${organizationPort}/approve
```

#### **📊 Document Information Displayed**

Each document shows:

```typescript
interface DocumentApproval {
  id: string;                    // Unique approval ID
  exportId: string;              // Export transaction ID (e.g., "EXP-2024-001")
  documentType: string;          // LICENSE | INVOICE | QUALITY | SHIPPING
  documentName: string;          // Human-readable name
  documentHash: string;          // SHA256 hash for verification
  exporterName: string;          // Submitting company name
  submissionDate: string;        // ISO timestamp of submission
  status: string;                // PENDING | APPROVED | REJECTED
  urgencyLevel: string;          // HIGH | MEDIUM | LOW
  comments?: string;             // Approval/rejection comments
  reviewedBy?: string;           // Approver identifier
  reviewDate?: string;           // Review timestamp
}
```

### **4. Approval Workflow**

#### **🔍 Document Review Process**

1. **View Pending Documents**: Approvers see documents in their queue
2. **Select Document**: Click "Review" to open detailed view
3. **Examine Details**: 
   - Export ID and exporter information
   - Document hash for integrity verification
   - Submission timestamp and urgency level
4. **Access Document Content**: 
   - Documents stored on IPFS can be retrieved using the hash
   - Cryptographic verification ensures document integrity
5. **Make Decision**: Choose Approve or Reject
6. **Add Comments**: Provide reasoning for the decision
7. **Submit Approval**: Decision is recorded on blockchain

#### **⚙️ Technical Implementation**

The approval process involves:

```typescript
// Approval submission to validator service
const approvalData = {
  documentHash: document.documentHash,
  exportId: document.exportId,
  action: "APPROVE" | "REJECT",
  comments: "Detailed review comments",
  reviewedBy: "Organization Officer"
};

// POST to organization-specific endpoint
fetch(`http://localhost:${organizationPort}/approve`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(approvalData)
});
```

### **5. Real-time Updates**

#### **🔄 Polling Mechanism**

- Frontend polls every 30 seconds for new documents
- New submissions appear automatically in pending queue
- Status updates reflect in real-time
- Completed approvals move to historical view

#### **📧 Event-Driven Notifications**

- Blockchain events trigger validator notifications
- API Gateway routes validation requests
- Organizations only see relevant document types
- Audit trail maintained on blockchain

## 🎯 Practical Example

### **Scenario: Coffee Export Submission**

1. **Colombian Coffee Co.** submits export request with:
   - Export License (for National Bank)
   - Commercial Invoice (for Exporter Bank)  
   - Quality Certificate (for Coffee Authority)
   - Shipping Documents (for Customs)

2. **System Processing**:
   - Documents uploaded to IPFS
   - Blockchain events emitted for each document type
   - API Gateway notifies all four validator services

3. **Approver Experience**:
   - **National Bank** sees license document in pending queue
   - **Exporter Bank** sees invoice document
   - **Coffee Authority** sees quality certificate
   - **Customs** sees shipping documents

4. **Parallel Review**:
   - Each organization reviews independently
   - Approvals/rejections recorded on blockchain
   - Final export status determined when all validations complete

## 🔧 Configuration

### **Environment Setup**

Organizations are configured in `ORGANIZATION_CONFIG`:

```typescript
const ORGANIZATION_CONFIG = {
  'national-bank': {
    name: 'National Bank',
    role: 'License Validator',
    documentTypes: ['LICENSE'],
    port: 8080
  },
  // ... other organizations
};
```

### **Access URLs**

- **Frontend**: `http://localhost:3000/approvers`
- **API Gateway**: `http://localhost:8000`
- **Validator Services**: `http://localhost:{organizationPort}`

## 📋 Summary

Approvers see submitted documents through:

1. **Organization-specific dashboards** showing relevant document types
2. **Real-time polling** for new submissions every 30 seconds  
3. **Blockchain event notifications** triggering validation requests
4. **IPFS document storage** for secure, decentralized access
5. **Comprehensive metadata** including export details and submission info
6. **Approval interface** for review, comment, and decision submission

The system ensures each organization only sees documents they need to validate, maintains complete audit trails, and provides real-time updates for efficient processing of coffee export approvals.