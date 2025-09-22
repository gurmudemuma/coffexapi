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
        
        // Handle different possible API response formats with more robust mapping
        const metrics: DashboardMetrics = {
          totalRequests: data.totalRequests ?? data.total_requests ?? data.total ?? 0,
          pendingApproval: data.pendingApproval ?? data.pending_approval ?? data.pending ?? 0,
          approved: data.approved ?? data.approved_count ?? 0,
          rejected: data.rejected ?? data.requires_action ?? data.rejected_count ?? 0
        };
        
        // Ensure all values are numbers
        metrics.totalRequests = Number(metrics.totalRequests) || 0;
        metrics.pendingApproval = Number(metrics.pendingApproval) || 0;
        metrics.approved = Number(metrics.approved) || 0;
        metrics.rejected = Number(metrics.rejected) || 0;
        
        setDashboardMetrics(metrics);
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

    return () => clearInterval(interval);
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
        setFilterStatus('PENDING');
        break;
      case 'approved':
        setFilterStatus('APPROVED');
        break;
      case 'rejected':
        setFilterStatus('REJECTED');
        break;
      case 'totalRequests':
        setFilterStatus(null); // Show all requests
        break;
      default:
        setFilterStatus(null);
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
        <header className="bg-purple-900 border-b border-yellow-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">Exporter Dashboard</h1>
              <p className="text-purple-300">Welcome back, {exporterName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold">
                  {exporterName.charAt(0)}
                </div>
                <span className="font-medium text-yellow-400">{exporterName}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
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
                  className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-white"
                  onClick={() => handleMetricClick('totalRequests')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Total Requests</p>
                        <p className="text-3xl font-bold text-black">
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
                  className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200 bg-white"
                  onClick={() => handleMetricClick('pendingApproval')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Pending Approval</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {loading ? '...' : dashboardMetrics.pendingApproval}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-white"
                  onClick={() => handleMetricClick('approved')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Approved</p>
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
                  className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200 bg-white"
                  onClick={() => handleMetricClick('rejected')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Requires Action</p>
                        <p className="text-3xl font-bold text-black">
                          {loading ? '...' : dashboardMetrics.rejected}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-purple-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-black">
                      <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-auto py-4 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                        onClick={() => setActiveView('submit')}
                      >
                        <Plus className="w-6 h-6 mb-2" />
                        <span>New Export</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center justify-center border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => setActiveView('requests')}
                      >
                        <FileText className="w-6 h-6 mb-2" />
                        <span>View Requests</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-purple-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-black">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-purple-600 text-center py-4">
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
            <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">New Export Request</h2>
              <ExportForm />
            </div>
          )}

          {activeView === 'documents' && (
            <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Document Hub</h2>
              <p className="text-purple-600">Document repository would go here.</p>
            </div>
          )}

          {activeView === 'help' && (
            <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Help & Support</h2>
              <p className="text-purple-600">Help documentation and support resources would go here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExporterLayout;