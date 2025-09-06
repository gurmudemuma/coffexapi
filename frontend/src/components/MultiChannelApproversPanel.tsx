import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, CheckCircle, XCircle, Clock, Eye, FileText, Users, Activity, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { toast } from 'sonner';

// Types for multi-channel approval system
interface ApprovalStageInfo {
  id: string;
  exportId: string;
  documentType: string;
  organization: string;
  stageOrder: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW';
  assignedTo: string;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
  documentHash: string;
  exporterName: string;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface BankSupervisorViewData {
  exportId: string;
  exporterName: string;
  totalStages: number;
  completedStages: number;
  currentStage?: ApprovalStageInfo;
  overallStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
  documents: DocumentInfo[];
  lastActivity: string;
  timeline: ApprovalActivity[];
}

interface ApprovalActivity {
  type: string;
  organization: string;
  reviewedBy: string;
  comments: string;
  timestamp: string;
  documentType: string;
}

interface DocumentInfo {
  type: string;
  hash: string;
  ipfsCid: string;
  size: number;
  status: string;
  assignedOrg: string;
}

type UserRole = 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';

interface MultiChannelApproversPanelProps {
  organizationType: string;
  userRole?: UserRole;
}

export const MultiChannelApproversPanel: React.FC<MultiChannelApproversPanelProps> = ({ 
  organizationType, 
  userRole = 'APPROVER' 
}) => {
  console.log('[DEBUG] MultiChannelApproversPanel component rendered with:', { organizationType, userRole });
  
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalStageInfo[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<ApprovalStageInfo[]>([]);
  const [supervisorViews, setSupervisorViews] = useState<BankSupervisorViewData[]>([]);
  const [selectedExport, setSelectedExport] = useState<BankSupervisorViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingDocument, setReviewingDocument] = useState<ApprovalStageInfo | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');

  // Organization configuration
  const getOrganizationConfig = () => {
    const configs = {
      'national-bank': {
        name: 'National Bank',
        role: 'License Validator',
        documentTypes: ['Export License'],
        color: 'bg-blue-500'
      },
      'exporter-bank': {
        name: 'Exporter Bank',
        role: 'Invoice Validator & Supervisor',
        documentTypes: ['Commercial Invoice'],
        color: 'bg-green-500'
      },
      'coffee-authority': {
        name: 'Coffee Quality Authority',
        role: 'Quality Validator',
        documentTypes: ['Quality Certificate'],
        color: 'bg-amber-500'
      },
      'customs': {
        name: 'Customs Authority',
        role: 'Shipping Validator',
        documentTypes: ['Shipping Documents'],
        color: 'bg-purple-500'
      }
    };
    return configs[organizationType as keyof typeof configs] || configs['national-bank'];
  };

  const config = getOrganizationConfig();
  const isSupervisor = userRole === 'BANK_SUPERVISOR' || userRole === 'BANK';

  // Debug logging
  console.log(`[DEBUG] Component initialized with org: ${organizationType}, role: ${userRole}`);
  console.log(`[DEBUG] Organization config:`, config);

  // Fetch organization-specific pending approvals
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      console.log(`[DEBUG] Fetching approvals for org: ${organizationType}, role: ${userRole}`);
      
      const url = `http://localhost:8000/api/approval-channels/pending?org=${organizationType}`;
      console.log(`[DEBUG] Making request to: ${url}`);
      
      // First try without headers to test basic connectivity
      try {
        console.log('[DEBUG] Testing basic connectivity without headers...');
        const testResponse = await fetch(url);
        console.log(`[DEBUG] Basic test response: ${testResponse.status}`);
      } catch (error) {
        console.log('[DEBUG] Basic connectivity test failed:', error);
      }
      
      const response = await fetch(url, {
        headers: {
          'X-User-Role': userRole,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[DEBUG] Response status: ${response.status}, ok: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG] API Response:', data);
        console.log('[DEBUG] Pending approvals array:', data.pendingApprovals);
        console.log('[DEBUG] Array length:', data.pendingApprovals?.length || 0);
        
        const approvals = data.pendingApprovals || [];
        setPendingApprovals(approvals);
        console.log('[DEBUG] State updated with approvals:', approvals.length, 'items');
        console.log('[DEBUG] Individual approvals:', approvals);
      } else {
        const errorText = await response.text();
        console.error('[ERROR] Failed to fetch pending approvals:', response.statusText, errorText);
      }
    } catch (error) {
      console.error('[ERROR] Network error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch supervisor view (for bank supervisors)
  // Document viewing with fallback access system
  const handleViewDocument = async (approval: ApprovalStageInfo) => {
    console.log('[DEBUG] Starting document view process for:', approval);
    
    try {
      // First attempt: Try to access document via API Gateway with decryption
      const response = await fetch(
        `http://localhost:8000/api/documents/${approval.documentHash}?action=view`,
        {
          headers: {
            'X-User-Role': userRole,
            'X-Organization': organizationType,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[DEBUG] API Gateway response status:', response.status);
      console.log('[DEBUG] API Gateway response headers:', [...response.headers.entries()]);

      // Check if response is JSON (encrypted document info) or blob (decrypted document)
      const contentType = response.headers.get('content-type');
      console.log('[DEBUG] Response content type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        // This is a JSON response with decryption information
        const jsonData = await response.json();
        console.log('[DEBUG] Received JSON response:', jsonData);
        
        // Try to decrypt the document
        if (jsonData.encrypted && jsonData.ipfsCid && jsonData.key && jsonData.iv) {
          console.log('[DEBUG] Document is encrypted, attempting decryption with provided keys');
          
          try {
            // Import the IPFS service
            const { downloadFromIPFS } = await import('@/services/ipfsService');
            console.log('[DEBUG] IPFS service imported successfully');
            
            // Download and decrypt the document
            console.log('[DEBUG] Calling downloadFromIPFS with:', {
              ipfsCid: jsonData.ipfsCid,
              key: jsonData.key.substring(0, 8) + '...', // Log only first 8 chars of key for security
              iv: jsonData.iv.substring(0, 8) + '...'    // Log only first 8 chars of iv for security
            });
            
            const blob = await downloadFromIPFS(jsonData.ipfsCid, {
              key: jsonData.key,
              iv: jsonData.iv
            });
            
            console.log('[DEBUG] Decryption successful, blob size:', blob.size);
            console.log('[DEBUG] Blob type:', blob.type);
            
            // Check if blob is valid and not encrypted
            if (blob.size > 0) {
              // Check if the blob is actually a PDF by looking at the first few bytes
              const arrayBuffer = await blob.arrayBuffer();
              const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
              const header = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
              console.log('[DEBUG] First 4 bytes of decrypted blob:', header);
              
              // Check if it's a valid PDF
              const isPDF = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
              console.log('[DEBUG] Is valid PDF:', isPDF);
              
              if (isPDF) {
                // Create object URL and download the file
                const url = window.URL.createObjectURL(blob);
                console.log('[DEBUG] Created object URL:', url);
                
                // Create a temporary link to download the file
                const a = document.createElement('a');
                a.href = url;
                a.download = `document-${approval.documentHash}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Clean up the object URL
                window.URL.revokeObjectURL(url);
                
                toast.success('Document decrypted and downloaded successfully');
                return;
              } else {
                console.warn('[WARN] Decrypted blob is not a valid PDF, trying direct IPFS access');
              }
            } else {
              console.warn('[WARN] Decrypted blob is empty, trying direct IPFS access');
            }
          } catch (decryptError) {
            console.error('[ERROR] Decryption failed:', decryptError);
          }
        }
        
        // If we have an IPFS CID, try direct access
        if (jsonData.ipfsCid) {
          console.log('[DEBUG] Trying direct IPFS access');
          const ipfsGateways = [
            `http://localhost:8090/ipfs/${jsonData.ipfsCid}`,
            `https://ipfs.io/ipfs/${jsonData.ipfsCid}`,
            `https://cloudflare-ipfs.com/ipfs/${jsonData.ipfsCid}`,
            `https://gateway.pinata.cloud/ipfs/${jsonData.ipfsCid}`
          ];
          
          for (const gateway of ipfsGateways) {
            try {
              console.log('[DEBUG] Trying IPFS gateway:', gateway);
              window.open(gateway, '_blank');
              toast.success('Document accessed via IPFS gateway.');
              return;
            } catch (error) {
              console.warn(`[WARN] IPFS gateway ${gateway} failed:`, error);
              continue;
            }
          }
        }
      } else if (response.ok) {
        // Success: Document decrypted and accessible
        console.log('[DEBUG] Document already decrypted, serving directly');
        const blob = await response.blob();
        console.log('[DEBUG] Direct blob size:', blob.size);
        console.log('[DEBUG] Direct blob type:', blob.type);
        
        // Create object URL and download the file
        const url = window.URL.createObjectURL(blob);
        console.log('[DEBUG] Created object URL:', url);
        
        // Create a temporary link to download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${approval.documentHash}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(url);
        
        toast.success('Document downloaded successfully');
        return;
      } else {
        console.warn('[WARN] API Gateway response not OK:', response.status);
      }
    } catch (error) {
      console.warn('[WARN] Primary document access failed:', error);
    }

    // Fallback: Try direct IPFS access through multiple gateways using documentHash as CID
    console.log('[DEBUG] Trying fallback IPFS access methods');
    const ipfsGateways = [
      `http://localhost:8090/ipfs/${approval.documentHash}`,
      `https://ipfs.io/ipfs/${approval.documentHash}`,
      `https://cloudflare-ipfs.com/ipfs/${approval.documentHash}`,
      `https://gateway.pinata.cloud/ipfs/${approval.documentHash}`
    ];

    for (const gateway of ipfsGateways) {
      try {
        console.log('[DEBUG] Trying IPFS gateway:', gateway);
        window.open(gateway, '_blank');
        toast.success(
          'Document accessed via IPFS gateway.',
          { duration: 4000 }
        );
        return;
      } catch (error) {
        console.warn(`[WARN] IPFS gateway ${gateway} failed:`, error);
        continue;
      }
    }

    toast.error(
      'Unable to access document. The document may be temporarily unavailable. Please contact the document owner or try again later.',
      { duration: 6000 }
    );
  };

  // Fetch supervisor view (for bank supervisors)
  const fetchSupervisorView = async () => {
    if (!isSupervisor) return;

    try {
      setLoading(true);
      const response = await fetch(
        'http://localhost:8000/api/supervisor/exports',
        {
          headers: {
            'X-User-Role': userRole,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSupervisorViews(data.exports || []);
      } else if (response.status === 403) {
        toast.error('Access denied: Bank supervisor privileges required');
      }
    } catch (error) {
      console.error('Error fetching supervisor view:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit approval decision
  const submitApprovalDecision = async (approval: ApprovalStageInfo, decision: 'APPROVE' | 'REJECT', comments: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/approval-channels/submit-decision?org=${organizationType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': userRole
          },
          body: JSON.stringify({
            documentHash: approval.documentHash,
            exportId: approval.exportId,
            action: decision,
            comments: comments,
            reviewedBy: `${config.name} Officer`
          })
        }
      );
      
      if (response.ok) {
        toast.success(`Document ${decision.toLowerCase()}d successfully`);
        // Remove from pending and refresh
        setPendingApprovals(prev => prev.filter(p => p.id !== approval.id));
        setReviewingDocument(null);
        setReviewComments('');
      } else {
        toast.error('Failed to submit approval decision');
      }
    } catch (error) {
      console.error('Error submitting approval:', error);
      toast.error('Network error occurred');
    }
  };

  useEffect(() => {
    console.log(`[DEBUG] useEffect triggered with org: ${organizationType}, role: ${userRole}, isSupervisor: ${isSupervisor}`);
    
    if (isSupervisor) {
      console.log('[DEBUG] Fetching supervisor view...');
      fetchSupervisorView();
    } else {
      console.log('[DEBUG] Fetching pending approvals...');
      fetchPendingApprovals();
    }

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      console.log('[DEBUG] Polling interval triggered');
      if (isSupervisor) {
        fetchSupervisorView();
      } else {
        fetchPendingApprovals();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [organizationType, userRole]);

  // Filter and search logic
  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesStatus = filterStatus === 'all' || approval.status.toLowerCase() === filterStatus;
    const matchesSearch = !searchTerm || 
      approval.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.exportId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  console.log('[DEBUG] Filter results:', {
    totalPending: pendingApprovals.length,
    filteredCount: filteredApprovals.length,
    filterStatus,
    searchTerm,
    pendingApprovals: pendingApprovals,
    filteredApprovals: filteredApprovals
  });

  const filteredSupervisorViews = supervisorViews.filter(view => {
    const matchesStatus = filterStatus === 'all' || view.overallStatus.toLowerCase() === filterStatus;
    const matchesSearch = !searchTerm ||
      view.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.exportId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Render approval stage card
  const renderApprovalCard = (approval: ApprovalStageInfo) => (
    <Card key={approval.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Badge 
            variant={approval.urgencyLevel === 'HIGH' ? 'destructive' : 
                    approval.urgencyLevel === 'MEDIUM' ? 'default' : 'secondary'}
          >
            {approval.urgencyLevel}
          </Badge>
          <span className="text-sm text-gray-500">{approval.documentType}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {new Date(approval.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-900">{approval.exporterName}</p>
            <p className="text-sm text-gray-600">Export ID: {approval.exportId}</p>
            <p className="text-sm text-gray-600">Stage: {approval.stageOrder}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDocument(approval)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => {
                      setReviewingDocument(approval);
                      setReviewComments('');
                      setReviewDecision('APPROVE');
                    }}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Review Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p><strong>Exporter:</strong> {approval.exporterName}</p>
                      <p><strong>Export ID:</strong> {approval.exportId}</p>
                      <p><strong>Document:</strong> {approval.documentType}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Decision</label>
                      <Select value={reviewDecision} onValueChange={(value) => setReviewDecision(value as 'APPROVE' | 'REJECT')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVE">Approve</SelectItem>
                          <SelectItem value="REJECT">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Comments</label>
                      <Textarea
                        value={reviewComments}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComments(e.target.value)}
                        placeholder="Add your review comments..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          if (reviewingDocument) {
                            submitApprovalDecision(reviewingDocument, reviewDecision, reviewComments);
                          }
                        }}
                        className="flex-1"
                        variant={reviewDecision === 'APPROVE' ? 'default' : 'destructive'}
                      >
                        {reviewDecision === 'APPROVE' ? 'Approve' : 'Reject'}
                      </Button>
                      <Button variant="outline" onClick={() => setReviewingDocument(null)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render supervisor export card
  const renderSupervisorCard = (view: BankSupervisorViewData) => (
    <Card key={view.exportId} className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedExport(view)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Badge 
            variant={view.overallStatus === 'APPROVED' ? 'default' : 
                    view.overallStatus === 'REJECTED' ? 'destructive' : 'secondary'}
          >
            {view.overallStatus}
          </Badge>
          <span className="text-sm text-gray-500">{view.exportId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {view.completedStages}/{view.totalStages}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-900">{view.exporterName}</p>
            <p className="text-sm text-gray-600">Documents: {view.documents.length}</p>
            <p className="text-sm text-gray-600">
              Progress: {Math.round((view.completedStages / view.totalStages) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Last Activity: {new Date(view.lastActivity).toLocaleDateString()}
            </p>
            {view.currentStage && (
              <p className="text-sm text-gray-600">
                Current: {view.currentStage.organization}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && (pendingApprovals.length === 0 && supervisorViews.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading approval data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {config.name} - {isSupervisor ? 'Supervisor Dashboard' : 'Approval Channel'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSupervisor ? 'Global oversight and approval monitoring' : `${config.role} • Manage ${config.documentTypes.join(', ').toLowerCase()} validations`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Badge variant="outline" className={`${config.color} text-white`}>
              {userRole === 'BANK_SUPERVISOR' ? 'Supervisor' : 'Approver'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by exporter name or export ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      {isSupervisor ? (
        /* Bank Supervisor View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  All Exports ({filteredSupervisorViews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {filteredSupervisorViews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No exports found</p>
                ) : (
                  filteredSupervisorViews.map(renderSupervisorCard)
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Export Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Export Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedExport ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedExport.exporterName}</h3>
                      <p className="text-sm text-gray-600">{selectedExport.exportId}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Stages</p>
                        <p className="font-semibold">{selectedExport.totalStages}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Completed</p>
                        <p className="font-semibold">{selectedExport.completedStages}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(selectedExport.completedStages / selectedExport.totalStages) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {selectedExport.timeline.length > 0 && (
                      <div>
                        <p className="text-gray-600 text-sm mb-2">Recent Activity</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedExport.timeline.slice(0, 3).map((activity, index) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              <p className="font-medium">{activity.organization}</p>
                              <p className="text-gray-600">{activity.type} - {activity.documentType}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Select an export to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Organization-Specific Approver View */
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Approvals ({filteredApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedApprovals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {/* Debug info */}
            <div className="text-xs text-gray-500 mb-2">
              [DEBUG] Org: {organizationType}, Role: {userRole}, Pending: {pendingApprovals.length}, Filtered: {filteredApprovals.length}
            </div>
            
            {filteredApprovals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Great! You're all caught up. No documents are currently waiting for your review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredApprovals.map(renderApprovalCard)
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Reviews</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Your completed document reviews will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MultiChannelApproversPanel;