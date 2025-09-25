import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  RefreshCw,
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExporterSidebar from './ExporterSidebar';
import { ExporterDashboard } from './ExporterDashboard';
import ExportForm from './ExportForm';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalRequests: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
}

// Add a more flexible interface to handle different API response formats
interface ApiDashboardMetrics {
  totalRequests?: number;
  total_requests?: number;
  total?: number;
  pendingApproval?: number;
  pending_approval?: number;
  pending?: number;
  approved?: number;
  approved_count?: number;
  rejected?: number;
  requires_action?: number;
  rejected_count?: number;
}

interface ExporterLayoutProps {
  exporterName?: string;
}

export const ExporterLayout: React.FC<ExporterLayoutProps> = ({ 
  exporterName = "Coffee Exporter Co." 
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalRequests: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/exporter/dashboard?exporter=${encodeURIComponent(exporterName)}`
      );
      
      if (response.ok) {
        const data: any = await response.json();
        console.log('Dashboard API Response:', data); // Log the actual response
        
        // Use the standard API response format
        const metrics: DashboardMetrics = {
          totalRequests: data.totalRequests ?? 0,
          pendingApproval: data.pendingApproval ?? 0,
          approved: data.approved ?? 0,
          rejected: data.rejected ?? 0
        };
        
        console.log('Parsed metrics:', metrics);
        
        // Ensure all values are numbers
        metrics.totalRequests = Number(metrics.totalRequests) || 0;
        metrics.pendingApproval = Number(metrics.pendingApproval) || 0;
        metrics.approved = Number(metrics.approved) || 0;
        metrics.rejected = Number(metrics.rejected) || 0;
        
        // If backend returns empty metrics, derive counts from requests API as fallback
        const looksEmpty =
          metrics.totalRequests === 0 &&
          metrics.pendingApproval === 0 &&
          metrics.approved === 0 &&
          metrics.rejected === 0;

        if (looksEmpty) {
          try {
            const listRes = await fetch(
              `http://localhost:8000/api/exporter/requests?exporter=${encodeURIComponent(exporterName)}&status=all`
            );
            if (listRes.ok) {
              const listData: any = await listRes.json();
              const requests: Array<{ status?: string } & Record<string, any>> = listData.requests || [];
              // Count by status (case-insensitive)
              let total = requests.length;
              let pending = 0;
              let approved = 0;
              let rejected = 0;
              for (const r of requests) {
                const s = (r.status || '').toString().toLowerCase();
                if (s === 'pending') pending++;
                else if (s === 'approved') approved++;
                else if (s === 'rejected') rejected++;
              }
              setDashboardMetrics({
                totalRequests: total,
                pendingApproval: pending,
                approved,
                rejected,
              });
            } else {
              setDashboardMetrics(metrics);
            }
          } catch (fallbackErr) {
            console.warn('Fallback requests fetch failed:', fallbackErr);
            setDashboardMetrics(metrics);
          }
        } else {
          setDashboardMetrics(metrics);
        }
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

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    // Listen for successful export submissions to refresh immediately with optimistic update
    const onExportSubmitted = () => {
      // Optimistically bump counters so user sees instant feedback
      setDashboardMetrics(prev => ({
        ...prev,
        totalRequests: (prev.totalRequests ?? 0) + 1,
        pendingApproval: (prev.pendingApproval ?? 0) + 1,
      }));
      // Ensure we're on dashboard and schedule a definitive refresh shortly after
      setActiveView('dashboard');
      setTimeout(() => {
        handleRefresh();
      }, 1500);
    };
    window.addEventListener('exportSubmissionSuccess', onExportSubmitted as EventListener);

    // Listen for approval decisions from approver dashboards to refresh exporter metrics immediately
    const onApprovalDecision = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail || {};
        const { action, exportId } = detail || {};
        // Show a friendly notification to the exporter
        if (action === 'APPROVE') {
          toast.success(`Your export ${exportId || ''} was approved by an approver channel`);
        } else if (action === 'REJECT') {
          toast.warning(`Your export ${exportId || ''} requires action (rejected by approver)`);
        }
      } catch {}
      // Refresh metrics right away
      handleRefresh();
    };
    window.addEventListener('approvalDecisionMade', onApprovalDecision as EventListener);

    // Refresh on window focus/visibility to reduce stale metrics
    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('visibilitychange', onVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('exportSubmissionSuccess', onExportSubmitted as EventListener);
      window.removeEventListener('approvalDecisionMade', onApprovalDecision as EventListener);
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
    };
  }, [exporterName]);

  const handleLogout = () => {
    // In a real implementation, you would clear auth tokens
    navigate('/login');
  };

  const handleMetricClick = (metric: keyof DashboardMetrics) => {
    // Navigate to requests view with appropriate filter
    setActiveView('requests');
    // Set filter based on the metric clicked
    switch (metric) {
      case 'pendingApproval':
        setFilterStatus('pending');
        break;
      case 'approved':
        setFilterStatus('approved');
        break;
      case 'rejected':
        setFilterStatus('rejected');
        break;
      case 'totalRequests':
        setFilterStatus('all'); // Show all requests
        break;
      default:
        setFilterStatus('all');
    }
  };

  return (
    <div className="flex h-screen bg-yellow-50">
      {/* Sidebar */}
      <ExporterSidebar 
        exporterName={exporterName} 
        onLogout={handleLogout} 
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          // Reset filter when changing views
          if (view !== 'requests') {
            setFilterStatus(null);
          }
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-yellow-200">Exporter Dashboard</h1>
              <p className="text-purple-100">Welcome back, {exporterName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-yellow-100 text-gray-900 hover:bg-yellow-200 border-none"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-purple-900 flex items-center justify-center font-semibold">
                  {exporterName.charAt(0)}
                </div>
                <span className="font-medium text-white">{exporterName}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMetricClick('totalRequests')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {loading ? '...' : dashboardMetrics.totalRequests}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMetricClick('pendingApproval')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {loading ? '...' : dashboardMetrics.pendingApproval}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMetricClick('approved')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {loading ? '...' : dashboardMetrics.approved}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMetricClick('rejected')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Requires Action</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {loading ? '...' : dashboardMetrics.rejected}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-auto py-4 flex flex-col items-center justify-center"
                        onClick={() => setActiveView('submit')}
                      >
                        <Plus className="w-6 h-6 mb-2" />
                        <span>New Export</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center justify-center"
                        onClick={() => setActiveView('requests')}
                      >
                        <FileText className="w-6 h-6 mb-2" />
                        <span>View Requests</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-500 text-center py-4">
                        Recent activity will appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'requests' && (
            <ExporterDashboard 
              exporterName={exporterName} 
              initialStatusFilter={filterStatus}
            />
          )}

          {activeView === 'submit' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">New Export Request</h2>
              <ExportForm />
            </div>
          )}

          {activeView === 'documents' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Document Hub</h2>
              <p>Document repository would go here.</p>
            </div>
          )}

          {activeView === 'help' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Help & Support</h2>
              <p>Help documentation and support resources would go here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExporterLayout;