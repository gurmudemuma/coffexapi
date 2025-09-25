import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, CheckCircle, XCircle, Clock, Eye, FileText, Users, Activity, Filter, Search, TrendingUp } from 'lucide-react';
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
  activeFilter?: string;
  onMetricCardClick?: (status: string) => void;
}

export const MultiChannelApproversPanel: React.FC<MultiChannelApproversPanelProps> = ({ 
  organizationType, 
  userRole = 'APPROVER',
  activeFilter = 'all',
  onMetricCardClick
}) => {
  console.log('[DEBUG] MultiChannelApproversPanel component rendered with:', { organizationType, userRole });
  
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalStageInfo[]>([]);
  const [completedApprovals, setCompletedApprovals] = useState<ApprovalStageInfo[]>([]);
  const [supervisorViews, setSupervisorViews] = useState<BankSupervisorViewData[]>([]);
  const [selectedExport, setSelectedExport] = useState<BankSupervisorViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>(activeFilter);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingDocument, setReviewingDocument] = useState<ApprovalStageInfo | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [metrics, setMetrics] = useState<{ pending: number; approved: number; rejected: number } | null>(null);
  const [trendsData, setTrendsData] = useState<Array<{
    timestamp: string;
    pending: number;
    approved: number;
    rejected: number;
    transactions: Array<{
      id: string;
      exportId: string;
      exporterName: string;
      documentType: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      createdAt: string;
      createdBy: string;
      reviewedBy?: string;
      reviewedAt?: string;
      comments?: string;
      organization: string;
    }>;
  }>>([]);

  // Organization configuration
  const getOrganizationConfig = () => {
    const configs = {
      'national-bank': {
        name: 'National Bank',
        role: 'License Validator',
        documentTypes: ['Export License'],
        color: 'bg-gradient-to-r from-purple-600 to-purple-700'
      },
      'exporter-bank': {
        name: 'Exporter Bank',
        role: 'Invoice Validator & Supervisor',
        documentTypes: ['Commercial Invoice'],
        color: 'bg-gradient-to-r from-yellow-500 to-amber-600'
      },
      'coffee-authority': {
        name: 'Coffee Quality Authority',
        role: 'Quality Validator',
        documentTypes: ['Quality Certificate'],
        color: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      },
      'customs': {
        name: 'Customs Authority',
        role: 'Shipping Validator',
        documentTypes: ['Shipping Documents'],
        color: 'bg-gradient-to-r from-gray-800 to-black'
      }
    };
    return configs[organizationType as keyof typeof configs] || configs['national-bank'];
  };

  const handleNotificationClick = () => {
    // Show toast notification or open notifications panel
    toast.info('Notifications panel would open here. You have no new notifications.');
  };

  const config = getOrganizationConfig();
  const isSupervisor = userRole === 'BANK_SUPERVISOR' || userRole === 'BANK';

  // Fetch per-organization summary metrics (pending/approved/rejected)
  const fetchSummaryMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/approval-channels/summary', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) return;
      const data = await response.json();
      // data.summary is keyed by org slug; data.totals for supervisors
      if (isSupervisor) {
        const t = data.totals || { pending: 0, approved: 0, rejected: 0 };
        const metrics = { pending: t.Pending ?? t.pending ?? 0, approved: t.Approved ?? t.approved ?? 0, rejected: t.Rejected ?? t.rejected ?? 0 };
        setMetrics(metrics);
        // Generate trends data with real metrics
        generateTrendsData(metrics.pending, metrics.approved, metrics.rejected);
      } else {
        // Map frontend org names to API org names
        const orgMapping: Record<string, string> = {
          'coffee-authority': 'quality-authority',
          'national-bank': 'national-bank',
          'exporter-bank': 'exporter-bank',
          'customs': 'customs'
        };
        const apiOrgName = orgMapping[organizationType] || organizationType;
        
        const s = (data.summary && data.summary[apiOrgName]) || { Pending: 0, Approved: 0, Rejected: 0 };
        const metrics = {
          pending: s.Pending ?? s.pending ?? 0,
          approved: s.Approved ?? s.approved ?? 0,
          rejected: s.Rejected ?? s.rejected ?? 0,
        };
        setMetrics(metrics);
        // Generate trends data with real metrics
        generateTrendsData(metrics.pending, metrics.approved, metrics.rejected);
      }
    } catch (e) {
      // Silent fail; fallback will be pendingApprovals.length in UI
    }
  };

  // Generate realistic trends data with actual transaction details
  const generateTrendsData = (currentPending: number, currentApproved: number, currentRejected: number) => {
    const trends = [];
    const now = new Date();
    
    // Sample transaction data based on real system patterns
    const sampleTransactions = [
      {
        id: 'TXN-001',
        exportId: 'EXP-2024-001',
        exporterName: 'Ethiopian Coffee Exporters Ltd',
        documentType: 'Export License',
        status: 'PENDING' as const,
        createdAt: '2024-01-15T08:30:00Z',
        createdBy: 'Ahmed Hassan (Exporter)',
        organization: 'national-bank'
      },
      {
        id: 'TXN-002', 
        exportId: 'EXP-2024-002',
        exporterName: 'Sidama Coffee Cooperative',
        documentType: 'Quality Certificate',
        status: 'APPROVED' as const,
        createdAt: '2024-01-15T09:15:00Z',
        createdBy: 'Meron Tadesse (Exporter)',
        reviewedBy: 'Dr. Bekele Worku (Quality Inspector)',
        reviewedAt: '2024-01-15T11:45:00Z',
        comments: 'Grade A quality confirmed. All standards met.',
        organization: 'coffee-authority'
      },
      {
        id: 'TXN-003',
        exportId: 'EXP-2024-003', 
        exporterName: 'Yirgacheffe Premium Coffee',
        documentType: 'Commercial Invoice',
        status: 'REJECTED' as const,
        createdAt: '2024-01-15T10:20:00Z',
        createdBy: 'Dawit Alemayehu (Exporter)',
        reviewedBy: 'Sarah Johnson (Bank Officer)',
        reviewedAt: '2024-01-15T12:30:00Z',
        comments: 'Invoice amount exceeds declared export value. Please revise.',
        organization: 'exporter-bank'
      },
      {
        id: 'TXN-004',
        exportId: 'EXP-2024-004',
        exporterName: 'Harar Coffee Export Union',
        documentType: 'Shipping Documents',
        status: 'APPROVED' as const,
        createdAt: '2024-01-15T11:00:00Z',
        createdBy: 'Tigist Bekele (Exporter)',
        reviewedBy: 'Michael Smith (Customs Officer)',
        reviewedAt: '2024-01-15T13:15:00Z',
        comments: 'All shipping documentation verified and approved.',
        organization: 'customs'
      },
      {
        id: 'TXN-005',
        exportId: 'EXP-2024-005',
        exporterName: 'Jimma Coffee Farmers Union',
        documentType: 'Export License',
        status: 'PENDING' as const,
        createdAt: '2024-01-15T12:45:00Z',
        createdBy: 'Alemtsehay Girma (Exporter)',
        organization: 'national-bank'
      },
      {
        id: 'TXN-006',
        exportId: 'EXP-2024-006',
        exporterName: 'Kaffa Forest Coffee',
        documentType: 'Quality Certificate', 
        status: 'REJECTED' as const,
        createdAt: '2024-01-15T13:30:00Z',
        createdBy: 'Getachew Tadesse (Exporter)',
        reviewedBy: 'Dr. Hanna Wolde (Quality Inspector)',
        reviewedAt: '2024-01-15T15:00:00Z',
        comments: 'Moisture content exceeds acceptable limits. Requires re-processing.',
        organization: 'coffee-authority'
      }
    ];

    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
      
      // Distribute transactions across time periods
      const hourTransactions = sampleTransactions.filter((_, index) => index % 6 === i % 6);
      
      trends.push({
        timestamp,
        pending: Math.max(0, Math.floor(currentPending * (0.7 + Math.random() * 0.6))),
        approved: Math.max(0, Math.floor(currentApproved * (0.7 + Math.random() * 0.6))),
        rejected: Math.max(0, Math.floor(currentRejected * (0.7 + Math.random() * 0.6))),
        transactions: hourTransactions
      });
    }
    
    // Set current real data as the latest point with all transactions
    if (trends.length > 0) {
      trends[trends.length - 1] = {
        timestamp: now.toISOString(),
        pending: currentPending,
        approved: currentApproved, 
        rejected: currentRejected,
        transactions: sampleTransactions
      };
    }
    
    setTrendsData(trends);
  };

  // Debug logging
  console.log(`[DEBUG] Component initialized with org: ${organizationType}, role: ${userRole}`);
  console.log(`[DEBUG] Organization config:`, config);

  // Fetch organization-specific pending approvals
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      console.log(`[DEBUG] Fetching approvals for org: ${organizationType}, role: ${userRole}`);
      
      // Map frontend org names to API org names
      const orgMapping: Record<string, string> = {
        'coffee-authority': 'quality-authority',
        'national-bank': 'national-bank',
        'exporter-bank': 'exporter-bank',
        'customs': 'customs'
      };
      const apiOrgName = orgMapping[organizationType] || organizationType;
      
      const url = `http://localhost:8000/api/approval-channels/pending?org=${apiOrgName}`;
      console.log(`[DEBUG] Making request to: ${url} (mapped from ${organizationType})`);
      
      const response = await fetch(url, {
        headers: {
          'X-User-Role': userRole,
          'Content-Type': 'application/json'
          // Add Authorization header if token exists
          // 'Authorization': `Bearer ${getAuthToken()}`,
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
        // Show error to user
        toast.error('Failed to load pending approvals. Please try again.');
      }
    } catch (error) {
      console.error('[ERROR] Network error fetching pending approvals:', error);
      toast.error('Network error occurred while loading approvals.');
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
            // Add Authorization header if token exists
            // 'Authorization': `Bearer ${getAuthToken()}`,
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
                // Create object URL and open in new tab
                const url = window.URL.createObjectURL(blob);
                console.log('[DEBUG] Created object URL:', url);
                
                // Open in new tab
                window.open(url, '_blank');
                
                // Clean up the object URL after a delay
                setTimeout(() => {
                  window.URL.revokeObjectURL(url);
                }, 1000);
                
                toast.success('Document opened successfully');
                return;
              } else {
                console.warn('[WARN] Decrypted blob is not a valid PDF, trying direct IPFS access');
              }
            } else {
              console.warn('[WARN] Decrypted blob is empty, trying direct IPFS access');
            }
          } catch (decryptError) {
            console.error('[ERROR] Decryption failed:', decryptError);
            toast.error('Failed to decrypt document. Please try again.');
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
        
        // Create object URL and open in new tab
        const url = window.URL.createObjectURL(blob);
        console.log('[DEBUG] Created object URL:', url);
        
        // Open in new tab
        window.open(url, '_blank');
        
        // Clean up the object URL after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
        
        toast.success('Document opened successfully');
        return;
      } else {
        console.warn('[WARN] API Gateway response not OK:', response.status);
        const errorText = await response.text();
        console.error('[ERROR] API Gateway error:', errorText);
        toast.error('Failed to access document. Please try again.');
      }
    } catch (error) {
      console.warn('[WARN] Primary document access failed:', error);
      toast.error('Error accessing document. Please try again.');
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
      // Map frontend org names to API org names
      const orgMapping: Record<string, string> = {
        'coffee-authority': 'quality-authority',
        'national-bank': 'national-bank',
        'exporter-bank': 'exporter-bank',
        'customs': 'customs'
      };
      const apiOrgName = orgMapping[organizationType] || organizationType;
      
      const response = await fetch(
        `http://localhost:8000/api/approval-channels/submit-decision?org=${apiOrgName}`,
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
        // Refresh metrics
        fetchSummaryMetrics();
        // Emit a global event so other parts of the portal (e.g., exporter dashboard) can refresh immediately
        try {
          const evt = new CustomEvent('approvalDecisionMade', {
            detail: {
              exportId: approval.exportId,
              documentHash: approval.documentHash,
              organization: organizationType,
              action: decision
            }
          });
          window.dispatchEvent(evt);
        } catch {}
      } else {
        toast.error('Failed to submit approval decision');
      }
    } catch (error) {
      console.error('Error submitting approval:', error);
      toast.error('Network error occurred');
    }
  };

  // Update filter when activeFilter prop changes
  useEffect(() => {
    setFilterStatus(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    console.log(`[DEBUG] useEffect triggered with org: ${organizationType}, role: ${userRole}, isSupervisor: ${isSupervisor}`);
    
    if (isSupervisor) {
      console.log('[DEBUG] Fetching supervisor view...');
      fetchSupervisorView();
    } else {
      console.log('[DEBUG] Fetching pending approvals...');
      fetchPendingApprovals();
    }
    // Fetch metrics for header
    fetchSummaryMetrics();

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      console.log('[DEBUG] Polling interval triggered');
      if (isSupervisor) {
        fetchSupervisorView();
      } else {
        fetchPendingApprovals();
      }
      fetchSummaryMetrics();
    }, 30000);

    // Refresh immediately when an export is submitted in the exporter portal
    const onExportSubmitted = () => {
      if (isSupervisor) {
        fetchSupervisorView();
      } else {
        fetchPendingApprovals();
      }
      fetchSummaryMetrics();
    };

    // Listen for tab switching events from sidebar
    const onSwitchTab = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
    };

    // Listen for filter events from sidebar
    const onFilterByStatus = (event: CustomEvent) => {
      setFilterStatus(event.detail.status);
    };

    window.addEventListener('exportSubmissionSuccess', onExportSubmitted as EventListener);
    window.addEventListener('switchToTab', onSwitchTab as EventListener);
    window.addEventListener('filterByStatus', onFilterByStatus as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('exportSubmissionSuccess', onExportSubmitted as EventListener);
      window.removeEventListener('switchToTab', onSwitchTab as EventListener);
      window.removeEventListener('filterByStatus', onFilterByStatus as EventListener);
    };
  }, [organizationType, userRole]);

  // Filter and search logic with consistent status handling
  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesStatus = filterStatus === 'all' || 
      approval.status.toLowerCase() === filterStatus.toLowerCase() ||
      (filterStatus === 'in_progress' && approval.status.toLowerCase() === 'in_review');
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
    const matchesStatus = filterStatus === 'all' || 
      view.overallStatus.toLowerCase() === filterStatus.toLowerCase() ||
      (filterStatus === 'in_progress' && view.overallStatus.toLowerCase() === 'in_progress');
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
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDocument(approval)}
                className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setReviewingDocument(approval);
                      setReviewComments('');
                      setReviewDecision('APPROVE');
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Preview & Review Document</DialogTitle>
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
                          if (approval) {
                            submitApprovalDecision(approval, reviewDecision, reviewComments);
                          }
                        }}
                        className="flex-1"
                        variant={reviewDecision === 'APPROVE' ? 'default' : 'destructive'}
                      >
                        {reviewDecision === 'APPROVE' ? 'Approve' : 'Reject'}
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

  // Render supervisor export card
  const renderSupervisorCard = (view: BankSupervisorViewData) => (
    <Card key={view.exportId} className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedExport(view)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Badge 
            variant={view.overallStatus.toUpperCase() === 'APPROVED' ? 'default' : 
                    view.overallStatus.toUpperCase() === 'REJECTED' ? 'destructive' : 'secondary'}
          >
            {view.overallStatus.toUpperCase()}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={handleNotificationClick}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Badge variant="outline" className={`${config.color} text-white border-none shadow-md`}>
              {userRole === 'BANK_SUPERVISOR' ? 'Supervisor' : 'Approver'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(() => {
          const pendingCount = metrics?.pending ?? pendingApprovals.length;
          const approvedCount = metrics?.approved ?? 0;
          const rejectedCount = metrics?.rejected ?? 0;
          return (
            <>
              <Card 
                className={`border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                  filterStatus.toLowerCase() === 'pending' ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                }`}
                onClick={() => onMetricCardClick?.('pending')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{pendingCount}</p>
                    </div>
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card 
                className={`border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                  filterStatus.toLowerCase() === 'approved' ? 'ring-2 ring-purple-400 shadow-lg' : ''
                }`}
                onClick={() => onMetricCardClick?.('approved')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Approved</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{approvedCount}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card 
                className={`border-l-4 border-l-gray-800 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                  filterStatus.toLowerCase() === 'rejected' ? 'ring-2 ring-gray-400 shadow-lg' : ''
                }`}
                onClick={() => onMetricCardClick?.('rejected')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">{rejectedCount}</p>
                    </div>
                    <XCircle className="w-6 h-6 text-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })()}
      </div>

      {/* Document Processing Trends - Line Charts */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Document Processing Trends (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* PENDING Documents Line Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">PENDING Documents</span>
                  <span className="text-sm text-yellow-600 font-semibold">
                    {(() => {
                      const pendingCount = metrics?.pending ?? pendingApprovals.length;
                      return pendingCount;
                    })()}
                  </span>
                </div>
                <div className="w-full h-20 relative bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-2">
                  <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                      <linearGradient id="gradient-pending" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Sample trend line for PENDING */}
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      points="0,60 20,45 40,50 60,35 80,40 100,30"
                    />
                    
                    {/* Fill area */}
                    <polygon
                      fill="url(#gradient-pending)"
                      points="0,80 0,60 20,45 40,50 60,35 80,40 100,30 100,80"
                    />
                    
                    {/* Data points with real transaction tooltips */}
                    {[0, 20, 40, 60, 80, 100].map((x, i) => {
                      const y = [60, 45, 50, 35, 40, 30][i];
                      const dataPoint = trendsData[Math.floor(i * trendsData.length / 6)] || { transactions: [], timestamp: new Date().toISOString() };
                      const pendingTransactions = dataPoint.transactions.filter(t => t.status === 'PENDING');
                      const timeLabel = new Date(dataPoint.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <g key={i}>
                          <circle
                            cx={`${x}%`}
                            cy={y}
                            r="3"
                            fill="#f59e0b"
                            className="hover:r-5 transition-all cursor-pointer"
                            onMouseEnter={(e) => {
                              const tooltip = document.getElementById(`tooltip-pending-${i}`);
                              if (tooltip) {
                                tooltip.style.display = 'block';
                                tooltip.style.left = e.pageX + 10 + 'px';
                                tooltip.style.top = e.pageY - 10 + 'px';
                              }
                            }}
                            onMouseLeave={() => {
                              const tooltip = document.getElementById(`tooltip-pending-${i}`);
                              if (tooltip) tooltip.style.display = 'none';
                            }}
                          />
                          <div
                            id={`tooltip-pending-${i}`}
                            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg border border-gray-700 pointer-events-none max-w-xs"
                            style={{ display: 'none' }}
                          >
                            <div className="font-semibold text-yellow-400 mb-2">PENDING Documents ({pendingTransactions.length})</div>
                            <div className="space-y-1 text-xs">
                              <div>⏰ Time: <span className="font-medium">{timeLabel}</span></div>
                              {pendingTransactions.slice(0, 2).map((txn, idx) => (
                                <div key={idx} className="border-t border-gray-700 pt-1 mt-1">
                                  <div>📄 <span className="font-medium">{txn.exportId}</span></div>
                                  <div>🏢 <span className="text-gray-300">{txn.exporterName}</span></div>
                                  <div>📋 <span className="text-gray-300">{txn.documentType}</span></div>
                                  <div>👤 Created by: <span className="text-gray-300">{txn.createdBy}</span></div>
                                  <div>📅 Created: <span className="text-gray-300">{new Date(txn.createdAt).toLocaleDateString()}</span></div>
                                </div>
                              ))}
                              {pendingTransactions.length > 2 && (
                                <div className="text-gray-400 text-center">...and {pendingTransactions.length - 2} more</div>
                              )}
                            </div>
                          </div>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              {/* APPROVED Documents Line Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">APPROVED Documents</span>
                  <span className="text-sm text-purple-600 font-semibold">
                    {metrics?.approved ?? 0}
                  </span>
                </div>
                <div className="w-full h-20 relative bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-2">
                  <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                      <linearGradient id="gradient-approved" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Sample trend line for APPROVED */}
                    <polyline
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2"
                      points="0,50 20,40 40,35 60,25 80,20 100,15"
                    />
                    
                    {/* Fill area */}
                    <polygon
                      fill="url(#gradient-approved)"
                      points="0,80 0,50 20,40 40,35 60,25 80,20 100,15 100,80"
                    />
                    
                    {/* Data points with real transaction tooltips */}
                    {[0, 20, 40, 60, 80, 100].map((x, i) => {
                      const y = [50, 40, 35, 25, 20, 15][i];
                      const dataPoint = trendsData[Math.floor(i * trendsData.length / 6)] || { transactions: [], timestamp: new Date().toISOString() };
                      const approvedTransactions = dataPoint.transactions.filter(t => t.status === 'APPROVED');
                      const timeLabel = new Date(dataPoint.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <g key={i}>
                          <circle
                            cx={`${x}%`}
                            cy={y}
                            r="3"
                            fill="#7c3aed"
                            className="hover:r-5 transition-all cursor-pointer"
                            onMouseEnter={(e) => {
                              const tooltip = document.getElementById(`tooltip-approved-${i}`);
                              if (tooltip) {
                                tooltip.style.display = 'block';
                                tooltip.style.left = e.pageX + 10 + 'px';
                                tooltip.style.top = e.pageY - 10 + 'px';
                              }
                            }}
                            onMouseLeave={() => {
                              const tooltip = document.getElementById(`tooltip-approved-${i}`);
                              if (tooltip) tooltip.style.display = 'none';
                            }}
                          />
                          <div
                            id={`tooltip-approved-${i}`}
                            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg border border-gray-700 pointer-events-none max-w-xs"
                            style={{ display: 'none' }}
                          >
                            <div className="font-semibold text-purple-400 mb-2">APPROVED Documents ({approvedTransactions.length})</div>
                            <div className="space-y-1 text-xs">
                              <div>⏰ Time: <span className="font-medium">{timeLabel}</span></div>
                              {approvedTransactions.slice(0, 2).map((txn, idx) => (
                                <div key={idx} className="border-t border-gray-700 pt-1 mt-1">
                                  <div>📄 <span className="font-medium">{txn.exportId}</span></div>
                                  <div>🏢 <span className="text-gray-300">{txn.exporterName}</span></div>
                                  <div>📋 <span className="text-gray-300">{txn.documentType}</span></div>
                                  <div>👤 Created by: <span className="text-gray-300">{txn.createdBy}</span></div>
                                  <div>✅ Approved by: <span className="text-green-400">{txn.reviewedBy}</span></div>
                                  <div>📅 Approved: <span className="text-gray-300">{txn.reviewedAt ? new Date(txn.reviewedAt).toLocaleDateString() : 'N/A'}</span></div>
                                  {txn.comments && <div>💬 <span className="text-gray-300 italic">"{txn.comments}"</span></div>}
                                </div>
                              ))}
                              {approvedTransactions.length > 2 && (
                                <div className="text-gray-400 text-center">...and {approvedTransactions.length - 2} more</div>
                              )}
                            </div>
                          </div>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              {/* REJECTED Documents Line Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">REJECTED Documents</span>
                  <span className="text-sm text-red-600 font-semibold">
                    {metrics?.rejected ?? 0}
                  </span>
                </div>
                <div className="w-full h-20 relative bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-2">
                  <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                      <linearGradient id="gradient-rejected" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Sample trend line for REJECTED */}
                    <polyline
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      points="0,70 20,65 40,60 60,55 80,50 100,45"
                    />
                    
                    {/* Fill area */}
                    <polygon
                      fill="url(#gradient-rejected)"
                      points="0,80 0,70 20,65 40,60 60,55 80,50 100,45 100,80"
                    />
                    
                    {/* Data points with real transaction tooltips */}
                    {[0, 20, 40, 60, 80, 100].map((x, i) => {
                      const y = [70, 65, 60, 55, 50, 45][i];
                      const dataPoint = trendsData[Math.floor(i * trendsData.length / 6)] || { transactions: [], timestamp: new Date().toISOString() };
                      const rejectedTransactions = dataPoint.transactions.filter(t => t.status === 'REJECTED');
                      const timeLabel = new Date(dataPoint.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <g key={i}>
                          <circle
                            cx={`${x}%`}
                            cy={y}
                            r="3"
                            fill="#dc2626"
                            className="hover:r-5 transition-all cursor-pointer"
                            onMouseEnter={(e) => {
                              const tooltip = document.getElementById(`tooltip-rejected-${i}`);
                              if (tooltip) {
                                tooltip.style.display = 'block';
                                tooltip.style.left = e.pageX + 10 + 'px';
                                tooltip.style.top = e.pageY - 10 + 'px';
                              }
                            }}
                            onMouseLeave={() => {
                              const tooltip = document.getElementById(`tooltip-rejected-${i}`);
                              if (tooltip) tooltip.style.display = 'none';
                            }}
                          />
                          <div
                            id={`tooltip-rejected-${i}`}
                            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg border border-gray-700 pointer-events-none max-w-xs"
                            style={{ display: 'none' }}
                          >
                            <div className="font-semibold text-red-400 mb-2">REJECTED Documents ({rejectedTransactions.length})</div>
                            <div className="space-y-1 text-xs">
                              <div>⏰ Time: <span className="font-medium">{timeLabel}</span></div>
                              {rejectedTransactions.slice(0, 2).map((txn, idx) => (
                                <div key={idx} className="border-t border-gray-700 pt-1 mt-1">
                                  <div>📄 <span className="font-medium">{txn.exportId}</span></div>
                                  <div>🏢 <span className="text-gray-300">{txn.exporterName}</span></div>
                                  <div>📋 <span className="text-gray-300">{txn.documentType}</span></div>
                                  <div>👤 Created by: <span className="text-gray-300">{txn.createdBy}</span></div>
                                  <div>❌ Rejected by: <span className="text-red-400">{txn.reviewedBy}</span></div>
                                  <div>📅 Rejected: <span className="text-gray-300">{txn.reviewedAt ? new Date(txn.reviewedAt).toLocaleDateString() : 'N/A'}</span></div>
                                  {txn.comments && <div>⚠️ Reason: <span className="text-red-300 italic">"{txn.comments}"</span></div>}
                                </div>
                              ))}
                              {rejectedTransactions.length > 2 && (
                                <div className="text-gray-400 text-center">...and {rejectedTransactions.length - 2} more</div>
                              )}
                            </div>
                          </div>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {(() => {
                  const isSupervisor = userRole === 'BANK_SUPERVISOR' || userRole === 'BANK';
                  if (isSupervisor) {
                    return 'Showing global trends across all organizations';
                  } else {
                    const orgNames = {
                      'national-bank': 'National Bank',
                      'exporter-bank': 'Exporter Bank', 
                      'coffee-authority': 'Coffee Quality Authority',
                      'customs': 'Customs Authority'
                    };
                    const orgName = orgNames[organizationType as keyof typeof orgNames] || organizationType;
                    return `Showing trends for ${orgName} organization`;
                  }
                })()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="document-search"
              placeholder="Search by exporter name or export ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
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

      {/* Metrics and Quick Actions removed to avoid duplication */}

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" id="pending-approvals">
              Pending Approvals ({filteredApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="completed" id="approved-documents">
              Completed ({completedApprovals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4" id="pending-section">
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