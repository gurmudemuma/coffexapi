import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Add as AddIcon, 
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Coffee as CoffeeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

import { 
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '../components/ui';

// Simple toast notification function
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-md text-white ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Simple Skeleton component since it's not available in the UI library
const Skeleton = ({ className = '', ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`} 
    {...props} 
  />
);

import { useAuth } from '../store';
import { useExports } from '../store';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

type ExportStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'VALIDATING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAYMENT_RELEASED';


const ExporterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { exports: exportsData, loading, error } = useExports();
  const navigate = useNavigate();
  
  const [accessError, setAccessError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalExports: 0,
    activeExports: 0,
    pendingValidation: 0,
    approvedExports: 0,
    totalValue: 0,
  });

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  // Organization-specific access validation
  useEffect(() => {
    if (!user) {
      setAccessError('User authentication required');
      return;
    }

    // Validate user's organization is Coffee Exporters Association
    if (user.organization !== 'Coffee Exporters Association') {
      setAccessError(`Access denied: This dashboard is only accessible to Coffee Exporters Association members. Your organization: ${user.organization}`);
      return;
    }

    // Validate user's role is EXPORTER
    if (user.role !== 'EXPORTER') {
      setAccessError(`Access denied: Only users with EXPORTER role can access this dashboard. Your role: ${user.role}`);
      return;
    }

    setAccessError(null);
  }, [user]);

  useEffect(() => {
    if (!accessError && user) {
      // Transform exports to summaries - only show exports belonging to current user
      const userExports = Object.values(exportsData || {}).filter((exportRequest: any) => {
        // Filter exports to only show those belonging to the current user
        return exportRequest?.exporterId === user?.id;
      });
      
      const summaries = userExports.map((exportRequest: any) => ({
        id: exportRequest.id,
        exportId: exportRequest.id,
        productType: exportRequest.tradeDetails?.productType || 'N/A',
        quantity: exportRequest.tradeDetails?.quantity || 0,
        totalValue: exportRequest.tradeDetails?.totalValue || 0,
        currency: exportRequest.tradeDetails?.currency || 'USD',
        destination: exportRequest.tradeDetails?.destination || 'N/A',
        status: exportRequest.status || 'DRAFT',
        submittedAt: exportRequest.submittedAt,
        validationProgress: exportRequest.validationSummary?.totalValidations > 0 
          ? (exportRequest.validationSummary.completedValidations / exportRequest.validationSummary.totalValidations) * 100 
          : 0,
        urgentActions: [],
      }));
      
      // Calculate statistics - only for user's exports
      const activeCount = summaries.filter((s: any) => ['SUBMITTED', 'VALIDATING'].includes(s.status)).length;
      const pendingCount = summaries.filter((s: any) => s.status === 'VALIDATING').length;
      const approvedCount = summaries.filter((s: any) => s.status === 'APPROVED').length;
      const totalVal = summaries.reduce((sum: number, s: any) => sum + s.totalValue, 0);
      
      setStats({
        totalExports: summaries.length,
        activeExports: activeCount,
        pendingValidation: pendingCount,
        approvedExports: approvedCount,
        totalValue: totalVal,
      });
    }
  }, [exportsData, user, accessError]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Display access error if user doesn't have proper organization access
  if (accessError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-red-500">
          <CardContent className="p-6">
            <Alert variant="error">
              <div className="flex items-center gap-3">
                <ShieldIcon className="h-6 w-6 text-red-500" />
                <div>
                  <AlertTitle>Organization Access Denied</AlertTitle>
                  <p className="mt-1">{accessError}</p>
                  <p className="text-sm mt-2">Please contact your system administrator if you believe this is an error.</p>
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: orgBranding.backgroundColor }}>
      {/* Quick Action Buttons with enhanced branding */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="default"
              className={`bg-${orgBranding.primaryColor} hover:bg-${orgBranding.secondaryColor} h-16 flex flex-col items-center gap-2 text-white`}
              onClick={() => navigate('/exports?tab=new-export')}
            >
              <AddIcon className="h-6 w-6" />
              <span className="font-semibold">Create New Export Request</span>
            </Button>
            <Button
              variant="outline"
              className={`border-${orgBranding.primaryColor} text-${orgBranding.primaryColor} hover:bg-${orgBranding.primaryColor} hover:text-white h-16 flex flex-col items-center gap-2`}
              onClick={() => navigate('/exports?tab=manage')}
            >
              <AssignmentIcon className="h-6 w-6" />
              <span className="font-semibold">Manage Export Requests</span>
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className={`text-${orgBranding.primaryColor} hover:bg-${orgBranding.primaryColor} hover:text-white flex items-center gap-2`}
              onClick={() => navigate('/exports')}
            >
              <TrendingUpIcon className="h-4 w-4" />
              Go to Export Management
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards with enhanced branding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={`border-l-4 border-l-[${orgBranding.primaryColor}]`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExports}</p>
              </div>
              <div className={`p-3 rounded-full bg-[${orgBranding.primaryColor}] bg-opacity-10`}>
                <AssignmentIcon className={`h-6 w-6 text-[${orgBranding.primaryColor}]`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-[${orgBranding.accentColor}]`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Exports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeExports}</p>
              </div>
              <div className={`p-3 rounded-full bg-[${orgBranding.accentColor}] bg-opacity-10`}>
                <PendingIcon className={`h-6 w-6 text-[${orgBranding.accentColor}]`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Exports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedExports}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-[${orgBranding.chartColors[3]}]`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue, 'USD')}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-[${orgBranding.chartColors[3]}] bg-opacity-10`}>
                <MoneyIcon className={`h-6 w-6 text-[${orgBranding.chartColors[3]}]`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Overview Section */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">📊 Export Activity Overview</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-medium">Monitor your coffee export performance and activity</p>
              <p className="text-sm text-blue-700 mt-1">
                Track your export trends, validation success rates, and business growth metrics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Export Status Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-700">Total Exports</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats.totalExports}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">Active (In Progress)</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.activeExports}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">Successfully Approved</span>
                  </div>
                  <span className="font-bold text-green-600">{stats.approvedExports}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-700">Pending Validation</span>
                  </div>
                  <span className="font-bold text-yellow-600">{stats.pendingValidation}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Business Performance</h4>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(stats.totalValue, 'USD')}
                  </div>
                  <div className="text-gray-600 text-sm">Total Export Value</div>
                  <div className="text-xs text-gray-500 mt-1">Cumulative value of all export requests</div>
                </div>
                
                {stats.totalExports > 0 && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {((stats.approvedExports / stats.totalExports) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-600 text-sm">Approval Success Rate</div>
                    <div className="text-xs text-gray-500 mt-1">Percentage of exports approved</div>
                  </div>
                )}
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalExports > 0 ? formatCurrency(stats.totalValue / stats.totalExports, 'USD') : '$0'}
                  </div>
                  <div className="text-gray-600 text-sm">Average Export Value</div>
                  <div className="text-xs text-gray-500 mt-1">Mean value per export request</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Ready to expand your coffee export business? 
              </p>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/exports?tab=new-export')}
              >
                <AddIcon className="h-4 w-4 mr-2" />
                Create Your Next Export Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExporterDashboard;