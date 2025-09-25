import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User, Building, Shield, Award, Truck, Crown, Clock, CheckCircle, XCircle, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultiChannelApproversPanel } from './MultiChannelApproversPanel';
import ApproverPanelSidebar from './ApproverPanelSidebar';
import BlockchainAnalytics from './BlockchainAnalytics';

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
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');

  const config = ORGANIZATION_CONFIGS[organizationType] || ORGANIZATION_CONFIGS['national-bank'];
  const Icon = config.icon;

  // Fetch real data from the API
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        // Fetch summary data from the API
        const response = await fetch('http://localhost:8000/api/approval-channels/summary', {
          headers: {
            'X-User-Role': userRole,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Use the same data structure as MultiChannelApproversPanel
          const isSupervisor = userRole === 'BANK_SUPERVISOR' || userRole === 'BANK';
          
          if (isSupervisor) {
            // Use totals for supervisors
            const t = data.totals || { Pending: 0, Approved: 0, Rejected: 0 };
            setSummary({
              pending: t.Pending ?? 0,
              approved: t.Approved ?? 0,
              rejected: t.Rejected ?? 0
            });
          } else {
            // Map frontend org names to API org names
            const orgMapping: Record<string, string> = {
              'coffee-authority': 'quality-authority',
              'national-bank': 'national-bank',
              'exporter-bank': 'exporter-bank',
              'customs': 'customs'
            };
            const apiOrgName = orgMapping[organizationType] || organizationType;
            
            // Use organization-specific data
            const s = (data.summary && data.summary[apiOrgName]) || { Pending: 0, Approved: 0, Rejected: 0 };
            setSummary({
              pending: s.Pending ?? 0,
              approved: s.Approved ?? 0,
              rejected: s.Rejected ?? 0
            });
          }
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

  const handleSidebarNavigation = (sectionId: string) => {
    console.log('Navigating to section:', sectionId);
    setActiveSection(sectionId);
    
    // Handle specific navigation actions
    switch (sectionId) {
      case 'dashboard':
        // Reset to dashboard view
        setActiveFilter('all');
        break;
      case 'pending':
        // Switch to pending filter and focus on pending tab
        setActiveFilter('pending');
        setActiveSection('pending');
        // Trigger tab switch in MultiChannelApproversPanel
        window.dispatchEvent(new CustomEvent('switchToTab', { detail: { tab: 'pending' } }));
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'pending' } }));
        break;
      case 'approved':
        // Switch to approved filter and focus on completed tab
        setActiveFilter('approved');
        setActiveSection('approved');
        window.dispatchEvent(new CustomEvent('switchToTab', { detail: { tab: 'completed' } }));
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'approved' } }));
        break;
      case 'rejected':
        // Switch to rejected filter
        setActiveFilter('rejected');
        setActiveSection('rejected');
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'rejected' } }));
        break;
      case 'search':
        // Focus on search input
        setActiveSection('search');
        setTimeout(() => {
          document.getElementById('document-search')?.focus();
        }, 100);
        break;
      case 'analytics':
        // Could navigate to analytics page or show analytics modal
        setActiveSection('analytics');
        console.log('Analytics section clicked');
        break;
      case 'notifications':
        // Could show notifications panel
        setActiveSection('notifications');
        console.log('Notifications clicked');
        break;
      case 'help':
        // Could open help modal or navigate to help page
        setActiveSection('help');
        console.log('Help section clicked');
        break;
      default:
        console.log('Unknown section:', sectionId);
    }
  };

  const handleMetricCardClick = (status: string) => {
    console.log('Metric card clicked:', status);
    const normalizedStatus = status.toLowerCase();
    setActiveFilter(normalizedStatus);
    
    // Update sidebar active state based on card click
    switch (normalizedStatus) {
      case 'pending':
        setActiveSection('pending');
        window.dispatchEvent(new CustomEvent('switchToTab', { detail: { tab: 'pending' } }));
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'pending' } }));
        break;
      case 'approved':
        setActiveSection('approved');
        window.dispatchEvent(new CustomEvent('switchToTab', { detail: { tab: 'completed' } }));
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'approved' } }));
        break;
      case 'rejected':
        setActiveSection('rejected');
        window.dispatchEvent(new CustomEvent('filterByStatus', { detail: { status: 'rejected' } }));
        break;
      default:
        setActiveSection('dashboard');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex">
      {/* Sidebar */}
      <ApproverPanelSidebar
        organizationType={organizationType}
        organizationName={config.name}
        userRole={getRoleDisplayName(userRole)}
        onLogout={handleLogout}
        pendingCount={summary.pending}
        approvedCount={summary.approved}
        rejectedCount={summary.rejected}
        activeSection={activeSection}
        onNavigate={handleSidebarNavigation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-black">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black flex items-center justify-center mr-3 shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">{config.name} Dashboard</h1>
                  <p className="text-sm text-purple-100">{config.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gradient-to-r hover:from-yellow-400/20 hover:to-amber-500/20 transition-all duration-200">
                  <Bell className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg">
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
                  className="flex items-center bg-gradient-to-r from-yellow-400/10 to-amber-500/10 text-white border-yellow-400/30 hover:bg-gradient-to-r hover:from-yellow-400/20 hover:to-amber-500/20 hover:border-yellow-400/50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg border border-purple-100">
            {activeSection === 'analytics' ? (
              <BlockchainAnalytics 
                organizationType={organizationType}
                userRole={getRoleDisplayName(userRole)}
              />
            ) : activeSection === 'notifications' ? (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Bell className="w-6 h-6 mr-3 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                </div>
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! New notifications will appear here when approvals require your attention.</p>
                </div>
              </div>
            ) : activeSection === 'help' ? (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <HelpCircle className="w-6 h-6 mr-3 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Learn how to use the approval system effectively.</p>
                      <Button variant="outline" className="w-full">
                        View Documentation
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Contact Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Get help from our support team.</p>
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <MultiChannelApproversPanel 
                organizationType={organizationType} 
                userRole={userRole}
                activeFilter={activeFilter}
                onMetricCardClick={handleMetricCardClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDashboard;