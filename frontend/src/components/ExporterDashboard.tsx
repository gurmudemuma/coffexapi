import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Bell,
  Eye,
  RefreshCw,
  Calendar,
  Activity,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
import { toast } from 'sonner';

// Types for Exporter Dashboard
interface DashboardMetrics {
  totalRequests: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  recentRequests?: ExporterRequest[];
  notifications?: DashboardNotification[];
}

interface ExporterRequest {
  exportId: string;
  referenceNumber: string;
  submissionDate: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  currentApprover: string;
  lastUpdated: string;
  documentCount: number;
  progressPercent: number;
  exporterName: string;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  destinationCountry: string;
  totalValue: number;
}

interface RequestDetail {
  exportId: string;
  referenceNumber: string;
  submissionDate: string;
  status: string;
  documents: DocumentStatus[];
  auditTrail: AuditTrailEntry[];
  currentApprover: string;
  canResubmit: boolean;
  progressPercent: number;
  exporterName: string;
  totalValue: number;
  destinationCountry: string;
}

interface DocumentStatus {
  type: string;
  displayName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverOrg: string;
  lastReviewDate?: string;
  comments: string;
  hash: string;
  ipfsCid: string;
  size: number;
}

interface AuditTrailEntry {
  timestamp: string;
  action: string;
  actor: string;
  organization: string;
  documentType: string;
  comments: string;
  description: string;
}

interface DashboardNotification {
  id: string;
  type: 'APPROVAL' | 'REJECTION' | 'UPDATE';
  exportId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ExporterDashboardProps {
  exporterName?: string;
  initialStatusFilter?: string | null;
}

export const ExporterDashboard: React.FC<ExporterDashboardProps> = ({ 
  exporterName = "Coffee Exporter Co.",
  initialStatusFilter = null
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [allRequests, setAllRequests] = useState<ExporterRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters and search
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/exporter/dashboard?exporter=${encodeURIComponent(exporterName)}`
      );
      
      if (response.ok) {
        const data: any = await response.json();
        console.log('ExporterDashboard API Response:', data); // Log the actual response
        
        // Handle different possible API response formats with more robust mapping
        const normalizedData: DashboardMetrics = {
          totalRequests: data.totalRequests ?? data.total_requests ?? data.total ?? 0,
          pendingApproval: data.pendingApproval ?? data.pending_approval ?? data.pending ?? 0,
          approved: data.approved ?? data.approved_count ?? 0,
          rejected: data.rejected ?? data.requires_action ?? data.rejected_count ?? 0,
          recentRequests: data.recentRequests ?? [],
          notifications: data.notifications ?? []
        };
        
        // Ensure all values are numbers
        normalizedData.totalRequests = Number(normalizedData.totalRequests) || 0;
        normalizedData.pendingApproval = Number(normalizedData.pendingApproval) || 0;
        normalizedData.approved = Number(normalizedData.approved) || 0;
        normalizedData.rejected = Number(normalizedData.rejected) || 0;
        
        setDashboardData(normalizedData);
      } else {
        console.error('Failed to fetch dashboard data:', response.statusText);
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all requests with filters
  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams({
        exporter: exporterName,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(
        `http://localhost:8000/api/exporter/requests?${params}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAllRequests(data.requests || []);
      } else {
        console.error('Failed to fetch requests:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch request detail
  const fetchRequestDetail = async (exportId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/exporter/request/${exportId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSelectedRequest(data);
      } else {
        console.error('Failed to fetch request detail:', response.statusText);
        toast.error('Failed to load request details');
      }
    } catch (error) {
      console.error('Error fetching request detail:', error);
      toast.error('Network error occurred');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRequests();

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [exporterName]);

  useEffect(() => {
    // Update status filter when initialStatusFilter changes
    if (initialStatusFilter !== null) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, searchTerm]);

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default';
      case 'REJECTED': return 'destructive';
      case 'PENDING': return 'secondary';
      default: return 'outline';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Filter requests
  const filteredRequests = allRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    const matchesSearch = !searchTerm || 
      request.exportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Export Dashboard</h1>
          <p className="text-purple-600 mt-2">
            Welcome back, {exporterName} • Track and manage your export requests
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              fetchDashboardData();
              fetchRequests();
            }}
            disabled={refreshing}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Requests</p>
                <p className="text-3xl font-bold text-black">
                  {dashboardData?.totalRequests || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Pending Approval</p>
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData?.pendingApproval || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Approved</p>
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData?.approved || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Requires Action</p>
                <p className="text-3xl font-bold text-black">
                  {dashboardData?.rejected || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications ({dashboardData?.notifications?.filter(n => !n.isRead).length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <Input
                  placeholder="Search by ID or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 border-purple-200 focus:border-purple-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-purple-600">
              {filteredRequests.length} of {allRequests.length} requests
            </div>
          </div>

          {/* Requests Table */}
          <Card className="border-purple-200 bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50 border-b border-purple-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Request</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Current Approver</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Progress</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Last Updated</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.exportId} className="hover:bg-yellow-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-black">{request.referenceNumber}</p>
                            <p className="text-sm text-purple-600">{request.exportId}</p>
                            <p className="text-xs text-purple-500">
                              Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusBadgeVariant(request.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-black">{request.currentApprover}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-purple-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${request.progressPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-purple-600">{request.progressPercent}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-black">
                            {new Date(request.lastUpdated).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fetchRequestDetail(request.exportId)}
                                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto border-purple-200">
                                <DialogHeader>
                                  <DialogTitle className="text-black">Export Request Details</DialogTitle>
                                </DialogHeader>
                                {selectedRequest && (
                                  <RequestDetailView request={selectedRequest} />
                                )}
                              </DialogContent>
                            </Dialog>
                            {request.status === 'REJECTED' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">No requests found</h3>
                  <p className="text-purple-600 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start by creating your first export request'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Export
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-purple-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Bell className="w-5 h-5 mr-2 text-purple-600" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification) => (
                    <div key={notification.id} 
                         className={`p-4 rounded-lg border ${notification.isRead ? 'bg-purple-50 border-purple-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-black">{notification.title}</h4>
                            <Badge variant="outline" className="border-purple-200 text-purple-600">
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-purple-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">No notifications</h3>
                  <p className="text-purple-600">You're all caught up! New notifications will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Request Detail View Component
const RequestDetailView: React.FC<{ request: RequestDetail }> = ({ request }) => {
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMITTED': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'FORWARDED': return <Activity className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Reference Number</p>
          <p className="font-semibold">{request.referenceNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <Badge variant={request.status === 'APPROVED' ? 'default' : 
                         request.status === 'REJECTED' ? 'destructive' : 'secondary'}>
            {request.status}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600">Progress</p>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${request.progressPercent}%` }}
              ></div>
            </div>
            <span className="text-sm">{request.progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Document Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {request.documents.map((doc, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{doc.displayName}</h4>
                  {getDocumentStatusIcon(doc.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">Approver: {doc.approverOrg}</p>
                {doc.lastReviewDate && (
                  <p className="text-xs text-gray-500">
                    Reviewed: {new Date(doc.lastReviewDate).toLocaleDateString()}
                  </p>
                )}
                {doc.comments && (
                  <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                    {doc.comments}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
        <div className="space-y-3">
          {request.auditTrail.map((entry, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="mt-1">
                {getActionIcon(entry.action)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{entry.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{entry.actor}</span>
                  <span>•</span>
                  <span>{entry.organization}</span>
                  <span>•</span>
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                {entry.comments && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{entry.comments}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {request.canResubmit && (
        <div className="flex gap-4 pt-4 border-t">
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Resubmit Documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExporterDashboard;