import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, CheckCircle, XCircle, Clock, Eye, FileText,
  Search, AlertCircle, RefreshCw, Shield, Archive,
  Activity, BarChart3, Settings, AlertTriangle, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ApproverSidebar from './ApproverSidebar';
import { NotificationsPanel } from './dashboard/NotificationsPanel';
import { ApprovalStatusChart } from './dashboard/ApprovalStatusChart';
import { getOrganizationConfig } from '../config/organizationConfig';


// Enhanced types for better document handling
interface DocumentApproval {
  id: string;
  exportId: string;
  documentType: string;
  organization: string;
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
  // Enhanced document properties
  ipfsCid?: string;
  ipfsUrl?: string;
  iv?: string;
  key?: string;
  encrypted?: boolean;
  contentType?: string;
  size?: number;
  documentPreview?: string; // Base64 preview if available
}

interface EnhancedApproverPanelProps {
  organizationType: string;
  userRole?: 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';
  initialView?: string;
  contentOnly?: boolean; // New prop to render only content without sidebar
  hideHeader?: boolean;
}

export const EnhancedApproverPanel: React.FC<EnhancedApproverPanelProps> = ({
  organizationType,
  userRole = 'APPROVER',
  initialView = 'pending',
  contentOnly = false,
  hideHeader = false,
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<DocumentApproval[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<DocumentApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingDocument, setReviewingDocument] = useState<DocumentApproval | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [viewingDocument, setViewingDocument] = useState<DocumentApproval | null>(null);
  const [activeView, setActiveView] = useState(initialView);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [searchResults, setSearchResults] = useState<DocumentApproval[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  // Add the missing urgentCount state variable
  const [notifications, setNotifications] = useState<any[]>([]);
  const [urgentCount, setUrgentCount] = useState(0);

  const config = getOrganizationConfig(organizationType);

  // Add the missing handleViewChange function
  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  // Add the missing handleLogout function
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout initiated');
    // This would typically involve clearing user session and redirecting
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/approval-channels/notifications?org=${organizationType}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Update urgentCount when pendingApprovals change
  useEffect(() => {
    const urgent = pendingApprovals.filter(a => a.urgencyLevel === 'HIGH').length;
    setUrgentCount(urgent);
  }, [pendingApprovals]);

  // Fetch pending approvals with enhanced error handling
  const fetchApprovals = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const pendingUrl = `http://localhost:8000/api/approval-channels/pending?org=${organizationType}`;
      console.log('Fetching pending approvals from:', pendingUrl);

      const pendingResponse = await fetch(pendingUrl, {
        headers: {
          'X-User-Role': userRole,
          'X-Organization': organizationType,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetch pending response status:', pendingResponse.status);

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        console.log('Fetched pending approvals data:', pendingData);
        const pendingApprovals = pendingData.pendingApprovals || [];

        const enhancedPendingApprovals = pendingApprovals.map((approval: any) => ({
          ...approval,
          documentType: approval.docType || approval.documentType,
          documentHash: approval.hash || approval.documentHash,
          ipfsCid: approval.ipfsCid,
          ipfsUrl: approval.ipfsUrl,
          iv: approval.iv,
          key: approval.key,
          encrypted: approval.encrypted,
          contentType: approval.contentType,
          size: approval.size,
          organization: approval.organization || organizationType,
          status: approval.status || 'PENDING',
          assignedTo: approval.assignedTo || '',
          createdAt: approval.createdAt || new Date().toISOString(),
          updatedAt: approval.updatedAt || new Date().toISOString(),
          urgencyLevel: approval.urgencyLevel || 'MEDIUM'
        }));

        setPendingApprovals(enhancedPendingApprovals);

        if (showRefreshIndicator) {
          toast.success(`Refreshed: ${enhancedPendingApprovals.length} pending approvals`);
        }
      } else {
        const errorText = await pendingResponse.text();
        console.error('Failed to fetch pending approvals:', errorText);
        toast.error('Failed to load pending approvals');
      }

      const completedUrl = `http://localhost:8000/api/completed-approvals?org=${organizationType}`;
      console.log('Fetching completed approvals from:', completedUrl);

      const completedResponse = await fetch(completedUrl, {
        headers: {
          'X-User-Role': userRole,
          'X-Organization': organizationType,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetch completed response status:', completedResponse.status);

      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        console.log('Fetched completed approvals data:', completedData);
        const completedApprovals = completedData.completedApprovals || [];

        const enhancedCompletedApprovals = completedApprovals.map((approval: any) => ({
          ...approval,
          documentType: approval.docType || approval.documentType,
          documentHash: approval.hash || approval.documentHash,
          ipfsCid: approval.ipfsCid,
          ipfsUrl: approval.ipfsUrl,
          iv: approval.iv,
          key: approval.key,
          encrypted: approval.encrypted,
          contentType: approval.contentType,
          size: approval.size,
          organization: approval.organization || organizationType,
          status: approval.status || 'PENDING',
          assignedTo: approval.assignedTo || '',
          createdAt: approval.createdAt || new Date().toISOString(),
          updatedAt: approval.updatedAt || new Date().toISOString(),
          urgencyLevel: approval.urgencyLevel || 'MEDIUM'
        }));

        setCompletedApprovals(enhancedCompletedApprovals);
      } else {
        const errorText = await completedResponse.text();
        console.error('Failed to fetch completed approvals:', errorText);
        toast.error('Failed to load completed approvals');
      }

    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [organizationType, userRole]);

  // Enhanced document viewing with better error handling and user feedback
  const handleViewDocument = async (approval: DocumentApproval) => {
    setViewingDocument(approval);

    try {
      toast.loading('Opening document...', { id: 'document-loading' });

      // First attempt: Try API Gateway with decryption
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

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();

        if (jsonData.encrypted && jsonData.ipfsCid && jsonData.key && jsonData.iv) {
          // Import IPFS service and decrypt
          const { downloadFromIPFS } = await import('@/services/ipfsService');

          const blob = await downloadFromIPFS(jsonData.ipfsCid, {
            key: jsonData.key,
            iv: jsonData.iv,
            onProgress: (progress) => {
              toast.loading(`Decrypting document... ${progress}%`, { id: 'document-loading' });
            }
          });

          if (blob.size > 0) {
            const arrayBuffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
            const isPDF = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;

            if (isPDF) {
              const url = window.URL.createObjectURL(blob);
              window.open(url, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(url), 1000);
              toast.success('Document opened successfully', { id: 'document-loading' });
              return;
            }
          }
        }

        // Fallback to IPFS gateways
        if (jsonData.ipfsCid) {
          const ipfsUrl = `http://localhost:8080/ipfs/${jsonData.ipfsCid}`;
          window.open(ipfsUrl, '_blank');
          toast.success('Document accessed via IPFS', { id: 'document-loading' });
          return;
        }
      } else if (response.ok) {
        // Direct blob response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        toast.success('Document opened successfully', { id: 'document-loading' });
        return;
      }

      // Final fallback
      const fallbackUrl = `http://localhost:8080/ipfs/${approval.documentHash}`;
      window.open(fallbackUrl, '_blank');
      toast.success('Document accessed via fallback', { id: 'document-loading' });

    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to open document', { id: 'document-loading' });
    } finally {
      setViewingDocument(null);
    }
  };

  // Enhanced approval submission with better feedback
  const submitApprovalDecision = async (approval: DocumentApproval, decision: 'APPROVE' | 'REJECT', comments: string) => {
    if (submittingApproval) return; // Prevent double submission

    try {
      setSubmittingApproval(true);
      toast.loading(`${decision === 'APPROVE' ? 'Approving' : 'Rejecting'} document...`, { id: 'approval-loading' });

      console.log('Submitting approval decision:', {
        documentHash: approval.documentHash,
        exportId: approval.exportId,
        action: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        comments: comments,
        reviewedBy: `${config.name} Officer`,
        organizationType,
        userRole
      });

      const response = await fetch('http://localhost:8000/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': userRole,
          'X-Organization': organizationType,
        },
        body: JSON.stringify({
          documentHash: approval.documentHash,
          exportId: approval.exportId,
          action: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          comments: comments || '',
          reviewedBy: `${config.name} Officer`,
          organization: organizationType,
          documentType: approval.documentType
        })
      });

      const responseText = await response.text();
      console.log('Approval response:', response.status, responseText);

      if (response.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { message: responseText };
        }

        toast.success(
          `Document ${decision.toLowerCase()}d successfully`,
          { id: 'approval-loading' }
        );

        // Close dialogs and reset state
        setApproveDialogOpen(false);
        setRejectDialogOpen(false);
        setReviewingDocument(null);
        setReviewComments('');

        // Remove from pending immediately for better UX
        setPendingApprovals(prev => prev.filter(p => p.id !== approval.id));

        // Refresh the list to get updated data from server
        setTimeout(() => {
          fetchPendingApprovals(true);
        }, 1000);
      } else {
        console.error('Approval failed:', response.status, responseText);
        toast.error(`Failed to submit decision: ${responseText}`, { id: 'approval-loading' });
      }
    } catch (error) {
      console.error('Error submitting approval:', error);
      toast.error('Network error occurred', { id: 'approval-loading' });
    } finally {
      setSubmittingApproval(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/search?q=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        console.error('Failed to fetch search results:', response.statusText);
        toast.error('Failed to perform search');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Network error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLog = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/activity-log?org=${organizationType}`);
      if (response.ok) {
        const data = await response.json();
        setActivityLog(data.log || []);
      } else {
        console.error('Failed to fetch activity log:', response.statusText);
        toast.error('Failed to load activity log');
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
      toast.error('Network error occurred while loading activity log');
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchApprovals();
    fetchNotifications();
    fetchActivityLog();
    const interval = setInterval(() => {
      fetchApprovals(true);
      fetchNotifications();
      fetchActivityLog();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchApprovals]);

  // Filter and search logic
  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesStatus = filterStatus === 'all' || approval.status.toLowerCase() === filterStatus;
    const matchesSearch = !searchTerm ||
      approval.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.exportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Enhanced approval card component with better UI and interaction
  const renderEnhancedApprovalCard = (approval: DocumentApproval) => (
    <Card key={approval.id} className="border-purple-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                approval.urgencyLevel === 'HIGH' ? 'bg-red-100' : 
                approval.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Shield className={`w-5 h-5 ${
                  approval.urgencyLevel === 'HIGH' ? 'text-red-600' : 
                  approval.urgencyLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-black">{approval.exporterName}</h3>
                <p className="text-sm text-purple-600">{approval.exportId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-purple-500">Document Type</p>
                <p className="font-medium text-black">{approval.documentType}</p>
              </div>
              <div>
                <p className="text-xs text-purple-500">Submitted</p>
                <p className="font-medium text-black">{new Date(approval.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-purple-500">Status</p>
                <Badge variant={
                  approval.status === 'APPROVED' ? 'approved' :
                  approval.status === 'REJECTED' ? 'rejected' : 'pending'
                }>
                  {approval.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-purple-500">Urgency</p>
                <Badge variant={
                  approval.urgencyLevel === 'HIGH' ? 'destructive' :
                  approval.urgencyLevel === 'MEDIUM' ? 'warning' : 'default'
                }>
                  {approval.urgencyLevel}
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(approval)}
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              
              {/* Approve Dialog - Fixing TypeScript error by using DialogTrigger correctly */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setReviewingDocument(approval);
                      setReviewDecision('APPROVE');
                      setApproveDialogOpen(true);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={submittingApproval}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-yellow-600" />
                        <span>Approve Document</span>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-black"><strong>Exporter:</strong> {reviewingDocument?.exporterName}</p>
                      <p className="text-black"><strong>Export ID:</strong> {reviewingDocument?.exportId}</p>
                      <p className="text-black"><strong>Document:</strong> {reviewingDocument?.documentType}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">Approval Comments</label>
                      <Textarea
                        value={reviewComments}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComments(e.target.value)}
                        placeholder="Add your approval comments (optional)..."
                        rows={3}
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          console.log('Approve button clicked, reviewingDocument:', reviewingDocument);
                          if (reviewingDocument) {
                            console.log('Submitting approval for:', reviewingDocument.exportId, reviewingDocument.documentType);
                            submitApprovalDecision(reviewingDocument, 'APPROVE', reviewComments);
                          } else {
                            console.error('No reviewing document set!');
                            toast.error('No document selected for review');
                          }
                        }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                        disabled={submittingApproval}
                      >
                        {submittingApproval ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Document
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setApproveDialogOpen(false);
                          setReviewingDocument(null);
                          setReviewComments('');
                        }}
                        disabled={submittingApproval}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Reject Dialog - Fixing TypeScript error by using DialogTrigger correctly */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setReviewingDocument(approval);
                      setReviewDecision('REJECT');
                      setRejectDialogOpen(true);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={submittingApproval}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-purple-600" />
                        <span>Reject Document</span>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-black"><strong>Exporter:</strong> {reviewingDocument?.exporterName}</p>
                      <p className="text-black"><strong>Export ID:</strong> {reviewingDocument?.exportId}</p>
                      <p className="text-black"><strong>Document:</strong> {reviewingDocument?.documentType}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Rejection Reason <span className="text-purple-600">*</span>
                      </label>
                      <Textarea
                        value={reviewComments}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewComments(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                        rows={3}
                        required
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          console.log('Reject button clicked, reviewingDocument:', reviewingDocument);
                          if (reviewingDocument && reviewComments.trim()) {
                            console.log('Submitting rejection for:', reviewingDocument.exportId, reviewingDocument.documentType);
                            submitApprovalDecision(reviewingDocument, 'REJECT', reviewComments);
                          } else {
                            console.error('Missing document or comments for rejection');
                            toast.error('Please provide a reason for rejection');
                          }
                        }}
                        variant="destructive"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        disabled={!reviewComments.trim() || submittingApproval}
                      >
                        {submittingApproval ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Document
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejectDialogOpen(false);
                          setReviewingDocument(null);
                          setReviewComments('');
                        }}
                        disabled={submittingApproval}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Cancel
                      </Button>
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

  const approvalChartData = pendingApprovals.reduce((acc, approval) => {
    const date = new Date(approval.createdAt).toLocaleDateString();
    let entry = acc.find((e) => e.date === date);
    if (!entry) {
      entry = { date, pending: 0, approved: 0, rejected: 0 };
      acc.push(entry);
    }
    if (approval.status === 'PENDING') entry.pending++;
    if (approval.status === 'APPROVED') entry.approved++;
    if (approval.status === 'REJECTED') entry.rejected++;
    return acc;
  }, [] as any[]);

  // Render different content based on active view
  const renderContentView = () => {
    switch (activeView) {
      case 'pending':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-purple-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Pending Approvals</p>
                      <p className="text-3xl font-bold text-black">{pendingApprovals.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">High Priority</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {pendingApprovals.filter(a => a.urgencyLevel === 'HIGH').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-400 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Document Types</p>
                      <p className="text-3xl font-bold text-black">{config.documentTypes?.length || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6 border-purple-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <Input
                        placeholder="Search by exporter name, export ID, or document type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Approvals List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                  <span className="ml-2 text-purple-600">Loading approvals...</span>
                </div>
              ) : filteredApprovals.length === 0 ? (
                <Card className="border-purple-200 bg-white">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No pending approvals</h3>
                    <p className="text-purple-600">
                      {searchTerm || filterStatus !== 'all'
                        ? 'No approvals match your current filters.'
                        : 'All documents have been processed.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApprovals.map(renderEnhancedApprovalCard)
              )}
            </div>
          </>
        );
      
      case 'urgent':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Urgent Reviews</h2>
            {pendingApprovals.filter(a => a.urgencyLevel === 'HIGH').length === 0 ? (
              <Card className="border-purple-200 bg-white">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">No urgent reviews</h3>
                  <p className="text-purple-600">All high priority documents have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              pendingApprovals.filter(a => a.urgencyLevel === 'HIGH').map(renderEnhancedApprovalCard)
            )}
          </div>
        );
      
      case 'approved':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Approved Documents</h2>
            {completedApprovals.filter(a => a.status === 'APPROVED').length === 0 ? (
              <Card className="border-purple-200 bg-white">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">No Approved Documents</h3>
                  <p className="text-purple-600">This section will show previously approved documents.</p>
                </CardContent>
              </Card>
            ) : (
              completedApprovals.filter(a => a.status === 'APPROVED').map(renderEnhancedApprovalCard)
            )}
          </div>
        );
      
      case 'rejected':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Rejected Documents</h2>
            {completedApprovals.filter(a => a.status === 'REJECTED').length === 0 ? (
              <Card className="border-purple-200 bg-white">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">No Rejected Documents</h3>
                  <p className="text-purple-600">This section will show previously rejected documents.</p>
                </CardContent>
              </Card>
            ) : (
              completedApprovals.filter(a => a.status === 'REJECTED').map(renderEnhancedApprovalCard)
            )}
          </div>
        );
      
      case 'search':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Document Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Search by exporter name, export ID, or document type..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                  <span className="ml-2 text-purple-600">Searching...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <Card className="border-purple-200 bg-white">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">Search for Documents</h3>
                    <p className="text-purple-600">Search through all documents by various criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                searchResults.map(renderEnhancedApprovalCard)
              )}
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Activity Log</h2>
            <Card className="border-purple-200 bg-white">
              <CardContent className="p-6">
                {activityLog.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No recent activity.</div>
                ) : (
                  <ul className="space-y-4">
                    {activityLog.map((item, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            <Activity className="h-5 w-5 text-gray-600" />
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-black">{item.message}</p>
                          <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Analytics & Reports</h2>
            <Card className="border-purple-200 bg-white">
              <CardHeader>
                <CardTitle>Approval Status Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalStatusChart data={approvalChartData} />
              </CardContent>
            </Card>
          </div>
        );
      
      case 'notifications':
        return <NotificationsPanel notifications={notifications} />;
      
      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black mb-6">Settings</h2>
            <Card className="border-purple-200 bg-white">
              <CardContent className="p-12 text-center">
                <Settings className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">Account Settings</h3>
                <p className="text-purple-600">Manage your account preferences and system settings.</p>
                <div className="mt-4">
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <Card className="border-purple-200 bg-white">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">Welcome to the Dashboard</h3>
                <p className="text-purple-600">Select a view from the sidebar to get started.</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  // Main render function
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      {!hideHeader && (
        <div className="bg-purple-900 shadow-sm border-b border-yellow-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-yellow-400">{config.name}</h1>
                  <p className="text-sm text-purple-300">{config.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchApprovals(true)}
                  disabled={refreshing}
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <Badge className="bg-purple-600 text-white hover:bg-purple-700">{pendingApprovals.length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContentView()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedApproverPanel;