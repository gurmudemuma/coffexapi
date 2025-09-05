import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store';
import { useExports, type ExportStatus, type ExportSummary } from '../../hooks/useExports';
import { ORGANIZATION_BRANDING } from '../../config/organizationBranding';
import { useDebounce } from '../../shared/hooks/useDebounce';

import {
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Badge,
  Alert,
  AlertTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Select,
} from '../ui';

import {
  Plus as PlusIcon,
  RefreshCw as RefreshIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Coffee as CoffeeIcon,
  FileText as AssignmentIcon,
  Clock as PendingIcon,
  CheckCircle as CheckCircleIcon,
  DollarSign as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  List as ListIcon
} from 'lucide-react';

interface UnifiedExporterDashboardProps {
  className?: string;
  viewMode?: 'full' | 'simplified' | 'stats-only';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  trend 
}) => (
  <Card className="border-l-4" style={{ borderLeftColor: color }}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-6 w-6", 
            style: { color } 
          })}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UnifiedExporterDashboard: React.FC<UnifiedExporterDashboardProps> = ({
  className = '',
  viewMode = 'full'
}) => {
  const { user } = useAuth();
  const { exportSummaries, stats, loading, error, refreshExports } = useExports();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExportStatus | 'ALL'>('ALL');
  
  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  // Memoized utility functions for better performance
  const formatCurrency = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, []);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'secondary';
      case 'VALIDATING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      case 'PAYMENT_RELEASED': return 'success';
      default: return 'default';
    }
  }, []);

  // Memoized button handlers for better performance
  const handleViewExport = useCallback((exportId: string) => {
    navigate(`/export/${exportId}`);
  }, [navigate]);

  const handleEditExport = useCallback((exportId: string) => {
    navigate(`/export/${exportId}/edit`);
  }, [navigate]);

  const handleNewExport = useCallback(() => {
    navigate('/export/new');
  }, [navigate]);

  const handleViewExports = useCallback(() => {
    navigate('/export/manage');
  }, [navigate]);

  const handleRefreshExports = useCallback(async () => {
    setRefreshLoading(true);
    try {
      await refreshExports();
    } catch (err) {
      console.error('Failed to refresh exports:', err);
    } finally {
      setRefreshLoading(false);
    }
  }, [refreshExports]);

  // Memoized CSV generation and download functions
  const generateExportsCSV = useCallback((data: ExportSummary[]) => {
    const headers = ['Export ID', 'Product Type', 'Quantity', 'Value', 'Destination', 'Status', 'Submitted'];
    const rows = data.map(exp => [
      exp.exportId || '',
      exp.productType || '',
      exp.quantity?.toString() || '',
      exp.currency && exp.totalValue ? formatCurrency(exp.totalValue, exp.currency) : '',
      exp.destination || '',
      exp.status || '',
      exp.submittedAt ? formatDate(exp.submittedAt) : ''
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }, [formatCurrency, formatDate]);

  const downloadCSV = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Memoized filtered exports for better performance (only search and status filtering)
  const filteredExports = useMemo(() => {
    return exportSummaries.filter((exp: ExportSummary) => {
      const matchesSearch = 
        exp.exportId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.productType.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.destination.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || exp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [exportSummaries, debouncedSearchTerm, statusFilter]);

  const handleExportData = useCallback(() => {
    // Export exports data as CSV
    const csvContent = generateExportsCSV(filteredExports);
    downloadCSV(csvContent, 'exports-data.csv');
  }, [filteredExports, generateExportsCSV]);

  if (loading) {
    return (
      <div className={`p-6 max-w-7xl mx-auto ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 max-w-7xl mx-auto ${className}`}>
        <Alert variant="error">
          <AlertTitle>Error Loading Exports</AlertTitle>
          <p>{error.message}</p>
          <div className="mt-4 text-sm">
            <p className="font-medium">Troubleshooting steps:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check your internet connection</li>
              <li>Verify that the backend service is running (usually on port 8000)</li>
              <li>Check that the API_GATEWAY_URL in your .env file is correct</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
          <div className="mt-4">
            <Button onClick={handleRefreshExports} variant="outline">
              <RefreshIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Simplified view - only show welcome content and action cards
  if (viewMode === 'simplified') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CoffeeIcon className="h-8 w-8" style={{ color: orgBranding.primaryColor }} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Exporter Panel</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Secure, efficient, and transparent coffee export documentation management
          </p>
        </div>

        {/* Professional Welcome Content with Improved Branding */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exporter Dashboard</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Manage your coffee export documentation efficiently through our blockchain-secured platform. 
                  Follow the steps below to initiate new exports or monitor existing requests.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                     style={{ 
                       backgroundColor: 'white',
                       borderColor: orgBranding.primaryColor,
                       boxShadow: `0 0 0 1px ${orgBranding.primaryColor}`
                     }}>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                         style={{ backgroundColor: `${orgBranding.primaryColor}20` }}>
                      <span className="font-bold" style={{ color: orgBranding.primaryColor }}>1</span>
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: orgBranding.primaryColor }}>
                      Create Export Request
                    </h3>
                  </div>
                  <p className="mb-4 text-gray-700">
                    Begin a new export process by providing essential shipment details and uploading required documentation.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">Complete export application form</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">Upload quality certificates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">Submit shipping documents</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Button
                      onClick={handleNewExport}
                      className="flex items-center gap-2"
                      style={{ backgroundColor: orgBranding.primaryColor }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Start New Export
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                     style={{ 
                       backgroundColor: 'white',
                       borderColor: orgBranding.secondaryColor,
                       boxShadow: `0 0 0 1px ${orgBranding.secondaryColor}`
                     }}>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                         style={{ backgroundColor: `${orgBranding.secondaryColor}20` }}>
                      <span className="font-bold" style={{ color: orgBranding.secondaryColor }}>2</span>
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: orgBranding.secondaryColor }}>
                      Manage Existing Exports
                    </h3>
                  </div>
                  <p className="mb-4 text-gray-700">
                    Track the progress of your export requests and access validated documentation.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">Monitor validation status</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">View approval history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">Download certified documents</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Button
                      onClick={handleViewExports}
                      variant="outline"
                      className="flex items-center gap-2"
                      style={{ 
                        borderColor: orgBranding.primaryColor,
                        color: orgBranding.primaryColor
                      }}
                    >
                      <ListIcon className="h-4 w-4" />
                      View Exports
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Platform Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.primaryColor }}></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Enhanced Security</h4>
                      <p className="text-gray-600 text-sm">Blockchain-secured documentation prevents fraud</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.secondaryColor }}></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Real-time Tracking</h4>
                      <p className="text-gray-600 text-sm">Monitor export progress at every stage</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.accentColor }}></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Regulatory Compliance</h4>
                      <p className="text-gray-600 text-sm">Ensure adherence to international trade standards</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  For technical support or assistance with export documentation, contact our dedicated team at support@coffeeexport.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Stats-only view - show only the statistics cards
  if (viewMode === 'stats-only') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Exports"
            value={stats.totalExports}
            icon={<AssignmentIcon />}
            color={orgBranding.primaryColor}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="In Progress"
            value={stats.activeExports}
            icon={<PendingIcon />}
            color={orgBranding.accentColor}
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Approved"
            value={stats.approvedExports}
            icon={<CheckCircleIcon />}
            color="#10B981" // Green-500
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(stats.totalValue, 'USD')}
            icon={<MoneyIcon />}
            color={orgBranding.chartColors?.[2] || '#3B82F6'}
          />
        </div>
      </div>
    );
  }

  // Full view - show complete dashboard with tabs
  return (
    <div className={`p-6 max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CoffeeIcon className="h-8 w-8" style={{ color: orgBranding.primaryColor }} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coffee Export Platform</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Secure, efficient, and transparent coffee export documentation management
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Management</h2>
          <p className="text-gray-600">
            Manage your coffee export requests and track their validation progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshExports}
            disabled={refreshLoading}
            className="flex items-center gap-2"
            style={{ 
              borderColor: orgBranding.primaryColor,
              color: orgBranding.primaryColor
            }}
          >
            <RefreshIcon className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2"
            style={{ 
              borderColor: orgBranding.accentColor,
              color: orgBranding.accentColor
            }}
          >
            <DownloadIcon className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={handleNewExport}
            className="flex items-center gap-2"
            style={{ backgroundColor: orgBranding.primaryColor }}
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Exports"
          value={stats.totalExports}
          icon={<AssignmentIcon />}
          color={orgBranding.primaryColor}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={stats.activeExports}
          icon={<PendingIcon />}
          color={orgBranding.accentColor}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Approved"
          value={stats.approvedExports}
          icon={<CheckCircleIcon />}
          color="#10B981" // Green-500
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue, 'USD')}
          icon={<MoneyIcon />}
          color={orgBranding.chartColors?.[2] || '#3B82F6'}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#F8F0FE]">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-white"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="new-export" 
            className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-white"
          >
            Create New Export
          </TabsTrigger>
          <TabsTrigger 
            value="manage" 
            className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-white"
          >
            Manage Exports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {/* Professional Welcome Content with Improved Branding */}
          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Exporter Dashboard</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Manage your coffee export documentation efficiently through our blockchain-secured platform. 
                    Follow the steps below to initiate new exports or monitor existing requests.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                       style={{ 
                         backgroundColor: 'white',
                         borderColor: orgBranding.primaryColor,
                         boxShadow: `0 0 0 1px ${orgBranding.primaryColor}`
                       }}>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                           style={{ backgroundColor: `${orgBranding.primaryColor}20` }}>
                        <span className="font-bold" style={{ color: orgBranding.primaryColor }}>1</span>
                      </div>
                      <h3 className="font-semibold text-lg" style={{ color: orgBranding.primaryColor }}>
                        Create Export Request
                      </h3>
                    </div>
                    <p className="mb-4 text-gray-700">
                      Begin a new export process by providing essential shipment details and uploading required documentation.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">Complete export application form</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">Upload quality certificates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">Submit shipping documents</span>
                      </li>
                    </ul>
                    <div className="mt-4">
                      <Button
                        onClick={handleNewExport}
                        className="flex items-center gap-2"
                        style={{ backgroundColor: orgBranding.primaryColor }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Start New Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                       style={{ 
                         backgroundColor: 'white',
                         borderColor: orgBranding.secondaryColor,
                         boxShadow: `0 0 0 1px ${orgBranding.secondaryColor}`
                       }}>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                           style={{ backgroundColor: `${orgBranding.secondaryColor}20` }}>
                        <span className="font-bold" style={{ color: orgBranding.secondaryColor }}>2</span>
                      </div>
                      <h3 className="font-semibold text-lg" style={{ color: orgBranding.secondaryColor }}>
                        Manage Existing Exports
                      </h3>
                    </div>
                    <p className="mb-4 text-gray-700">
                      Track the progress of your export requests and access validated documentation.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">Monitor validation status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">View approval history</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">Download certified documents</span>
                      </li>
                    </ul>
                    <div className="mt-4">
                      <Button
                        onClick={handleViewExports}
                        variant="outline"
                        className="flex items-center gap-2"
                        style={{ 
                          borderColor: orgBranding.primaryColor,
                          color: orgBranding.primaryColor
                        }}
                      >
                        <ListIcon className="h-4 w-4" />
                        View Exports
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Platform Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.primaryColor }}></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Enhanced Security</h4>
                        <p className="text-gray-600 text-sm">Blockchain-secured documentation prevents fraud</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.secondaryColor }}></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Real-time Tracking</h4>
                        <p className="text-gray-600 text-sm">Monitor export progress at every stage</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.accentColor }}></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Regulatory Compliance</h4>
                        <p className="text-gray-600 text-sm">Ensure adherence to international trade standards</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                    For technical support or assistance with export documentation, contact our dedicated team at support@coffeeexport.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="new-export" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create New Export Request
                </h3>
                <p className="text-gray-600 mb-4">
                  Start a new coffee export request with all required documentation
                </p>
                <Button
                  onClick={handleNewExport}
                  className="flex items-center gap-2 mx-auto"
                  style={{ backgroundColor: orgBranding.primaryColor }}
                >
                  <PlusIcon className="h-4 w-4" />
                  Start New Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search exports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ExportStatus | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2" style={{ borderColor: orgBranding.primaryColor }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="VALIDATING">Validating</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="PAYMENT_RELEASED">Payment Released</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                    }}
                    className="flex items-center gap-2"
                    style={{ 
                      borderColor: orgBranding.primaryColor,
                      color: orgBranding.primaryColor
                    }}
                  >
                    <FilterIcon className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exports Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Export ID</TableCell>
                    <TableCell>Product Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No exports found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExports.map((exp: ExportSummary) => (
                      <TableRow key={exp.id} >
                        <TableCell className="font-medium">{exp.exportId}</TableCell>
                        <TableCell>{exp.productType}</TableCell>
                        <TableCell>{exp.quantity.toLocaleString()} kg</TableCell>
                        <TableCell>{formatCurrency(exp.totalValue, exp.currency)}</TableCell>
                        <TableCell>{exp.destination}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(exp.status)}>
                            {exp.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#7B2CBF] h-2 rounded-full"
                                style={{ width: `${exp.validationProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.round(exp.validationProgress)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewExport(exp.id)}
                              className="flex items-center gap-1"
                              style={{ color: orgBranding.primaryColor }}
                            >
                              <EyeIcon className="h-4 w-4" />
                              View
                            </Button>
                            {['DRAFT', 'REJECTED'].includes(exp.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExport(exp.id)}
                                className="flex items-center gap-1"
                                style={{ color: orgBranding.primaryColor }}
                              >
                                <EditIcon className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};