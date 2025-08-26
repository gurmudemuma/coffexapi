import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, Download, MessageSquare } from 'lucide-react';

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
}

interface ApproversPanelProps {
  organizationType: 'national-bank' | 'customs' | 'quality-authority' | 'exporter-bank';
}

const ORGANIZATION_CONFIG = {
  'national-bank': {
    name: 'National Bank',
    role: 'License Validator',
    documentTypes: ['LICENSE'],
    color: 'blue',
    port: 8083
  },
  'customs': {
    name: 'Customs Authority', 
    role: 'Shipping Validator',
    documentTypes: ['SHIPPING'],
    color: 'green',
    port: 8082
  },
  'quality-authority': {
    name: 'Coffee Quality Authority',
    role: 'Quality Validator', 
    documentTypes: ['QUALITY'],
    color: 'purple',
    port: 8081
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    role: 'Invoice Validator',
    documentTypes: ['INVOICE'], 
    color: 'orange',
    port: 5000
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
  const [pendingApprovals, setPendingApprovals] = useState<DocumentApproval[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<DocumentApproval[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentApproval | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  const config = ORGANIZATION_CONFIG[organizationType];

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [organizationType]);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Real implementation: fetch from API Gateway
      const response = await fetch(`http://localhost:8000/api/pending-approvals?org=${organizationType}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch approvals: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to match our interface
      const pendingDocs: DocumentApproval[] = data.pendingApprovals?.map((item: any) => ({
        id: item.id || item.exportId + '_' + item.docType,
        exportId: item.exportId,
        documentType: item.docType,
        documentName: getDocumentName(item.docType),
        documentHash: item.hash,
        exporterName: item.exporterName || 'Unknown Exporter',
        submissionDate: item.timestamp || item.submissionDate,
        status: 'PENDING' as const,
        urgencyLevel: item.urgencyLevel || 'MEDIUM' as const,
        comments: item.comments,
        reviewedBy: item.reviewedBy,
        reviewDate: item.reviewDate
      })) || [];
      
      setPendingApprovals(pendingDocs);
      
      // Also fetch completed approvals
      const completedResponse = await fetch(`http://localhost:8000/api/completed-approvals?org=${organizationType}`);
      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        const completedDocs: DocumentApproval[] = completedData.completedApprovals?.map((item: any) => ({
          id: item.id || item.exportId + '_' + item.docType,
          exportId: item.exportId,
          documentType: item.docType,
          documentName: getDocumentName(item.docType),
          documentHash: item.hash,
          exporterName: item.exporterName || 'Unknown Exporter',
          submissionDate: item.timestamp || item.submissionDate,
          status: item.status || 'PENDING',
          urgencyLevel: item.urgencyLevel || 'MEDIUM' as const,
          comments: item.comments,
          reviewedBy: item.reviewedBy,
          reviewDate: item.reviewDate
        })) || [];
        setCompletedApprovals(completedDocs);
      }
      
    } catch (error) {
      console.error('Error fetching approvals:', error);
      
      // Fallback to mock data for development
      console.log('Falling back to mock data for development');
      const mockPending: DocumentApproval[] = [
        {
          id: '1',
          exportId: 'EXP-2024-001',
          documentType: config.documentTypes[0] as any,
          documentName: 'Export License Application',
          documentHash: 'a1b2c3d4e5f6789012345',
          exporterName: 'Colombian Coffee Co.',
          submissionDate: '2024-08-26T10:30:00Z',
          status: 'PENDING',
          urgencyLevel: 'HIGH'
        },
        {
          id: '2', 
          exportId: 'EXP-2024-002',
          documentType: config.documentTypes[0] as any,
          documentName: 'Commercial Invoice',
          documentHash: 'x9y8z7w6v5u4t3s2r1q0',
          exporterName: 'Brazilian Beans Ltd.',
          submissionDate: '2024-08-26T08:15:00Z',
          status: 'PENDING',
          urgencyLevel: 'MEDIUM'
        }
      ];

      setPendingApprovals(mockPending);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comments
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your review comments..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>

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
                  variant="destructive"
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