import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ApproverSidebar from './ApproverSidebar';
import { EnhancedApproverPanel } from './EnhancedApproverPanel';
import { toast } from 'sonner';
import { getOrganizationConfig } from '../config/organizationConfig';

interface DashboardMetrics {
  pending: number;
  approved: number;
  rejected: number;
  urgent: number;
}

interface ApproverLayoutProps {
  organizationType: string;
  userRole?: 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';
  userName?: string;
}

export const ApproverLayout: React.FC<ApproverLayoutProps> = ({ 
  organizationType,
  userRole = 'APPROVER',
  userName = 'Approver Officer'
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    pending: 0,
    approved: 0,
    rejected: 0,
    urgent: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const config = getOrganizationConfig(organizationType);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/approval-channels/summary?org=${organizationType}`,
        {
          headers: {
            'X-User-Role': userRole,
            'X-Organization': organizationType,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setDashboardMetrics({
          pending: data.pending || 0,
          approved: data.approved || 0,
          rejected: data.rejected || 0,
          urgent: data.urgent || 0
        });
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
  }, [organizationType, userRole]);

  const handleLogout = () => {
    // Clear any stored authentication tokens
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-yellow-50">
      {/* Sidebar */}
      <ApproverSidebar 
        organizationName={config.name}
        organizationType={organizationType}
        userRole={userRole}
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onLogout={handleLogout}
        pendingCount={dashboardMetrics.pending}
        urgentCount={dashboardMetrics.urgent}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-purple-900 border-b border-yellow-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
                <config.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">{config.name}</h1>
                <p className="text-purple-300">{config.role}</p>
              </div>
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
                  {userName.charAt(0)}
                </div>
                <span className="font-medium text-yellow-400">{userName}</span>
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
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Pending Approvals</p>
                        <p className="text-3xl font-bold text-black">
                          {loading ? '...' : dashboardMetrics.pending}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">High Priority</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {loading ? '...' : dashboardMetrics.urgent}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200">
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

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Rejected</p>
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
                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-auto py-4 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                        onClick={() => setActiveView('pending')}
                      >
                        <Clock className="w-6 h-6 mb-2" />
                        <span>Pending</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center justify-center border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => setActiveView('urgent')}
                      >
                        <XCircle className="w-6 h-6 mb-2" />
                        <span>Urgent</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
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

          {/* All other views use the EnhancedApproverPanel content */}
          {activeView !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm border border-purple-200">
              <EnhancedApproverPanel 
                organizationType={organizationType} 
                userRole={userRole}
                initialView={activeView}
                contentOnly={true}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApproverLayout;