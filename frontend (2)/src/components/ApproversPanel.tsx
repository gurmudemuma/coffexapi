import React, { useState, useEffect } from 'react';
import {
  StandardCard as Card,
  StandardCardContent as CardContent,
  StandardCardHeader as CardHeader,
  StandardCardTitle as CardTitle,
  StandardButton as Button,
  StandardBadge as Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from './ui';
import { CheckCircle, XCircle, Clock, Eye, Download, MessageSquare, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../store';

// Add the organization branding import
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface DocumentApproval {
  id: string;
  exportId: string;
  documentType: 'LICENSE' | 'INVOICE' | 'QUALITY' | 'SHIPPING';
  documentName: string;
  documentHash: string;
  exporterName: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  comments?: string;
  reviewedBy?: string;
  reviewDate?: string;
  organizationOnly?: boolean; // Flag for organization-specific data
  // Add organization field to ensure proper filtering
  organization?: string;
}

interface ApproversPanelProps {
  organizationType: 'national-bank' | 'customs' | 'quality-authority' | 'exporter-bank';
}

const ORGANIZATION_CONFIG = {
  'national-bank': {
    name: 'The Mint',
    role: 'License Validator',
    documentTypes: ['LICENSE'],
    color: 'blue',
    port: 8083,
    msp: 'NationalBankMSP',
    validRoles: ['NBE_ADMIN', 'NBE_OFFICER']
  },
  'customs': {
    name: 'Customs Authority', 
    role: 'Shipping Validator',
    documentTypes: ['SHIPPING'],
    color: 'green',
    port: 8082,
    msp: 'CustomsMSP',
    validRoles: ['CUSTOMS_VALIDATOR']
  },
  'quality-authority': {
    name: 'Coffee Quality Authority',
    role: 'Quality Validator', 
    documentTypes: ['QUALITY'],
    color: 'purple',
    port: 8081,
    msp: 'CoffeeAuthorityMSP',
    validRoles: ['QUALITY_INSPECTOR']
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    role: 'Invoice Validator',
    documentTypes: ['INVOICE'], 
    color: 'orange',
    port: 5000,
    msp: 'ExporterBankMSP',
    validRoles: ['BANK_VALIDATOR']
  }
};

// Helper function to get document display name
const getDocumentName = (docType: string): string => {
  const documentNames = {
    'LICENSE': 'Export License Application',
    'INVOICE': 'Commercial Invoice',
    'QUALITY': 'Quality Certificate',
    'SHIPPING': 'Shipping Documents'
  };
  return documentNames[docType as keyof typeof documentNames] || `${docType} Document`;
};

export default function ApproversPanel({ organizationType }: ApproversPanelProps) {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<DocumentApproval[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<DocumentApproval[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentApproval | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);

  const config = ORGANIZATION_CONFIG[organizationType];
  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING[organizationType];

  // Organization-specific access validation
  useEffect(() => {
    if (!user) {
      setAccessError('User authentication required');
      return;
    }

    // Validate user's organization matches the component's organization type
    const userOrgMap: Record<string, string> = {
      'The Mint': 'national-bank',
      'Customs Authority': 'customs',
      'Coffee Quality Authority': 'quality-authority',
      'Exporter Bank': 'exporter-bank',
      'Commercial Bank of Ethiopia': 'exporter-bank'
    };

    const expectedOrgType = userOrgMap[user.organization];
    if (expectedOrgType !== organizationType) {
      setAccessError(`Access denied: User organization '${user.organization}' not authorized for '${config.name}' operations`);
      return;
    }

    // Validate user's role is authorized for this organization
    if (!config.validRoles.includes(user.role)) {
      setAccessError(`Access denied: Role '${user.role}' not authorized for ${config.name}. Valid roles: ${config.validRoles.join(', ')}`);
      return;
    }

    setAccessError(null);
  }, [user, organizationType, config]);

  useEffect(() => {
    if (!accessError) {
      fetchApprovals();
      const interval = setInterval(fetchApprovals, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [organizationType, accessError]);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Enhanced API call with organization-specific headers and validation
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add user role for additional backend validation
      if (user?.role) {
        headers['X-User-Role'] = user.role;
      }
      
      // Add organization identifier for cross-validation
      if (user?.organization) {
        headers['X-Organization'] = organizationType;
      }

      const response = await fetch(`http://localhost:8000/api/pending-approvals?org=${organizationType}`, {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Organization access denied - insufficient permissions');
        } else if (response.status === 400) {
          throw new Error('Invalid organization parameter');
        }
        throw new Error(`Failed to fetch approvals: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure and organization-specific data
      if (!data.success) {
        throw new Error(data.error?.message || 'API request failed');
      }
      
      // Ensure we only receive data for our organization
      if (data.data.organization !== config.name && data.data.organizationMSP !== config.msp) {
        console.warn('Received data for different organization, filtering out');
        setPendingApprovals([]);
        setCompletedApprovals([]);
        return;
      }
      
      // Validate that all returned documents are for our organization's document type
      // AND belong to our organization
      const validPendingDocuments = data.data.pendingApprovals?.filter((item: any) => {
        const isValidDocType = item.docType === config.documentTypes[0];
        const isOrgSpecific = item.organizationOnly === true;
        const isCorrectOrganization = item.organization === config.name || !item.organization;
        
        if (!isValidDocType) {
          console.warn(`Filtered out document with wrong type: ${item.docType}, expected: ${config.documentTypes[0]}`);
          return false;
        }
        
        if (!isOrgSpecific) {
          console.warn('Filtered out document without organization-specific flag');
          return false;
        }
        
        if (!isCorrectOrganization) {
          console.warn(`Filtered out document for different organization: ${item.organization}`);
          return false;
        }
        
        return true;
      }) || [];
      
      const validCompletedDocuments = data.data.completedApprovals?.filter((item: any) => {
        const isValidDocType = item.docType === config.documentTypes[0];
        const isOrgSpecific = item.organizationOnly === true;
        const isCorrectOrganization = item.organization === config.name || !item.organization;
        
        if (!isValidDocType) {
          console.warn(`Filtered out completed document with wrong type: ${item.docType}, expected: ${config.documentTypes[0]}`);
          return false;
        }
        
        if (!isOrgSpecific) {
          console.warn('Filtered out completed document without organization-specific flag');
          return false;
        }
        
        if (!isCorrectOrganization) {
          console.warn(`Filtered out completed document for different organization: ${item.organization}`);
          return false;
        }
        
        return true;
      }) || [];
      
      setPendingApprovals(validPendingDocuments);
      setCompletedApprovals(validCompletedDocuments);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setPendingApprovals([]);
      setCompletedApprovals([]);
    }
    setLoading(false);
  };

  const handleApproval = async (documentId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const document = pendingApprovals.find(doc => doc.id === documentId);
      if (!document) return;

      // Submit approval/rejection to the validator service
      const approvalData = {
        documentHash: document.documentHash,
        exportId: document.exportId,
        action: action === 'APPROVED' ? 'APPROVE' : 'REJECT',
        comments: comment,
        reviewedBy: `${config.name} Officer`
      };

      const response = await fetch(`http://localhost:${config.port}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(approvalData)
      });

      if (!response.ok) {
        throw new Error(`Approval submission failed: ${response.status}`);
      }

      const approvalResult = await response.json();
      
      if (!approvalResult.success) {
        throw new Error(approvalResult.message || 'Approval failed');
      }

      const updatedDocument: DocumentApproval = {
        ...document,
        status: action,
        comments: comment,
        reviewedBy: `${config.name} Officer`,
        reviewDate: new Date().toISOString()
      };

      // Move from pending to completed
      setPendingApprovals(prev => prev.filter(doc => doc.id !== documentId));
      setCompletedApprovals(prev => [...prev, updatedDocument]);
      setSelectedDocument(null);
      setComment('');

      console.log(`Document ${action}:`, updatedDocument);
      
      // Show success message
      alert(`Document ${action.toLowerCase()} successfully!`);
      
    } catch (error) {
      console.error('Error processing approval:', error);
      alert(`Error processing approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { color: 'yellow', icon: Clock },
      APPROVED: { color: 'green', icon: CheckCircle },
      REJECTED: { color: 'red', icon: XCircle }
    };
    
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge variant={color as any} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (level: string) => {
    const colors = {
      HIGH: 'destructive',
      MEDIUM: 'default', 
      LOW: 'secondary'
    };
    return <Badge variant={colors[level as keyof typeof colors] as any}>{level}</Badge>;
  };

  // Display access error if user doesn't have proper organization access
  if (accessError) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            Organization Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Access Restricted</p>
              <p className="text-sm text-red-700 mt-1">{accessError}</p>
              <p className="text-xs text-red-600 mt-2">
                Please contact your system administrator if you believe this is an error.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Organization Header with Enhanced Security Info */}
      <Card className="border-l-4 border-l-blue-500 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-700">
                {config.name} - {config.role}
              </h3>
              <p className="text-xs text-gray-600">
                MSP: {config.msp} | Document Type: {config.documentTypes[0]} | User: {user?.name} ({user?.role})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {config.name} - Document Approval Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          {config.role} • Manage {config.documentTypes.join(', ').toLowerCase()} validations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedApprovals.filter(doc => doc.status === 'APPROVED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">
                  {completedApprovals.filter(doc => doc.status === 'REJECTED').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Approvals ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApprovals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4">
            {pendingApprovals.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{document.documentName}</h3>
                        {getUrgencyBadge(document.urgencyLevel)}
                        {getStatusBadge(document.status)}
                      </div>
                      <p className="text-gray-600 mb-1">Exporter: {document.exporterName}</p>
                      <p className="text-gray-600 mb-1">Export ID: {document.exportId}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(document.submissionDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingApprovals.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-gray-600">No pending approvals at this time.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4">
            {completedApprovals.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{document.documentName}</h3>
                        {getStatusBadge(document.status)}
                      </div>
                      <p className="text-gray-600 mb-1">Exporter: {document.exporterName}</p>
                      <p className="text-gray-600 mb-1">Reviewed by: {document.reviewedBy}</p>
                      <p className="text-sm text-gray-500">
                        Reviewed: {document.reviewDate ? new Date(document.reviewDate).toLocaleString() : 'N/A'}
                      </p>
                      {document.comments && (
                        <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                          "{document.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Review Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedDocument.documentName}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Export ID:</p>
                    <p className="font-medium">{selectedDocument.exportId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Exporter:</p>
                    <p className="font-medium">{selectedDocument.exporterName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Document Hash:</p>
                    <p className="font-mono text-xs">{selectedDocument.documentHash}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted:</p>
                    <p className="font-medium">{new Date(selectedDocument.submissionDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Textarea
                label="Review Comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your review comments..."
                rows={4}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleApproval(selectedDocument.id, 'APPROVED')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleApproval(selectedDocument.id, 'REJECTED')}
                  variant="danger"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => setSelectedDocument(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}