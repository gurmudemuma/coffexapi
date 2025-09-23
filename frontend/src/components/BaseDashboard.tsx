import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User, Building, Shield, Award, Truck, Crown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultiChannelApproversPanel } from './MultiChannelApproversPanel';
import ApproverSidebar from './ApproverSidebar';

interface OrganizationConfig {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  documentTypes: string[];
}

interface DashboardSummary {
  pending: number;
  approved: number;
  rejected: number;
}

const ORGANIZATION_CONFIGS: Record<string, OrganizationConfig> = {
  'national-bank': {
    name: 'National Bank',
    icon: Building,
    color: 'blue',
    description: 'License Validation Authority',
    documentTypes: ['Export License']
  },
  'customs': {
    name: 'Customs Authority',
    icon: Shield,
    color: 'green',
    description: 'Shipping Documentation Authority',
    documentTypes: ['Shipping Documents']
  },
  'coffee-authority': {
    name: 'Coffee Quality Authority',
    icon: Award,
    color: 'purple',
    description: 'Quality Certification Authority',
    documentTypes: ['Quality Certificate']
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    icon: Truck,
    color: 'orange',
    description: 'Invoice Validation Authority',
    documentTypes: ['Commercial Invoice']
  }
};

interface BaseDashboardProps {
  organizationType: string;
  userRole?: 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';
  userName?: string;
}

export const BaseDashboard: React.FC<BaseDashboardProps> = ({ 
  organizationType, 
  userRole = 'APPROVER',
  userName = 'John Doe'
}) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary>({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  const config = ORGANIZATION_CONFIGS[organizationType] || ORGANIZATION_CONFIGS['national-bank'];
  const Icon = config.icon;

  // Fetch real data from the API
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        // Fetch summary data from the API
        const response = await fetch(`http://localhost:8000/api/approval-channels/summary?org=${organizationType}`, {
          headers: {
            'X-User-Role': userRole,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSummary({
            pending: data.pending || 0,
            approved: data.approved || 0,
            rejected: data.rejected || 0
          });
        } else {
          console.error('Failed to fetch dashboard summary');
          // Fallback to mock data if API fails
          setSummary({
            pending: Math.floor(Math.random() * 10) + 5,
            approved: Math.floor(Math.random() * 20) + 10,
            rejected: Math.floor(Math.random() * 5)
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        // Fallback to mock data if API fails
        setSummary({
          pending: Math.floor(Math.random() * 10) + 5,
          approved: Math.floor(Math.random() * 20) + 10,
          rejected: Math.floor(Math.random() * 5)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    
    // Set up polling for live data
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, [organizationType, userRole]);

  const handleLogout = () => {
    // Clear any stored authentication tokens
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
    
    // Redirect to login page
    navigate('/login');
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'BANK_SUPERVISOR': return 'Bank Supervisor';
      case 'BANK': return 'Bank Officer';
      default: return 'Document Approver';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'BANK_SUPERVISOR': return Crown;
      case 'BANK': return Building;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(userRole);

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Top Navigation */}
      <div className="bg-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-yellow-400 text-purple-900 flex items-center justify-center mr-3">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-200">{config.name} Dashboard</h1>
                <p className="text-sm text-purple-100">{config.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-yellow-300 text-purple-900">
                  <RoleIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-purple-100">{getRoleDisplayName(userRole)}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-0">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <ApproverSidebar 
            organizationName={config.name}
            roleLabel={getRoleDisplayName(userRole)}
            onLogout={handleLogout}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
              <Clock className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-yellow-700">{summary.pending}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Documents awaiting review</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Requests</CardTitle>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-green-600">{summary.approved}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Documents approved this month</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected Requests</CardTitle>
              <XCircle className="h-5 w-5 text-purple-700" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-purple-700">{summary.rejected}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Documents rejected this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Approval Panel */}
        <div className="bg-white rounded-lg shadow-sm border">
          <MultiChannelApproversPanel 
            organizationType={organizationType} 
            userRole={userRole}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDashboard;