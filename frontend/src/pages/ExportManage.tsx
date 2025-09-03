import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { useExports, type ExportStatus, type ExportSummary } from '../hooks/useExports';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';
import { useDebounce } from '../shared/hooks/useDebounce';

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
} from '../components/ui';

import {
  Plus as PlusIcon,
  RefreshCw as RefreshIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
} from 'lucide-react';

const ExportManage: React.FC = () => {
  const { user } = useAuth();
  const { exportSummaries, stats, loading, error, refreshExports } = useExports();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('new-export');
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

  const handleCreateNewExport = useCallback(() => {
    setActiveTab('new-export');
  }, []);

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

  // Filter exports to only show those belonging to the current user
  const userFilteredExports = useMemo(() => {
    if (!user) return [];
    return exportSummaries.filter((exp: ExportSummary) => exp.exporterId === user.id);
  }, [exportSummaries, user]);

  // Memoized filtered exports for better performance
  const filteredExports = useMemo(() => {
    return userFilteredExports.filter((exp: ExportSummary) => {
      const matchesSearch = 
        exp.exportId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.productType.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.destination.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || exp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [userFilteredExports, debouncedSearchTerm, statusFilter]);

  // Calculate stats for the current user's exports
  const userStats = useMemo(() => {
    if (!user) return stats;
    
    const userExports = userFilteredExports;
    const totalExports = userExports.length;
    const activeExports = userExports.filter((exp: ExportSummary) => ['SUBMITTED', 'VALIDATING'].includes(exp.status)).length;
    const pendingValidation = userExports.filter((exp: ExportSummary) => exp.status === 'VALIDATING').length;
    const approvedExports = userExports.filter((exp: ExportSummary) => exp.status === 'APPROVED').length;
    const totalValue = userExports.reduce((sum: number, exp: ExportSummary) => sum + (exp.totalValue || 0), 0);
    
    return {
      totalExports,
      activeExports,
      pendingValidation,
      approvedExports,
      totalValue,
    };
  }, [userFilteredExports, user, stats]);

  const handleExportData = useCallback(() => {
    // Export exports data as CSV
    const csvContent = generateExportsCSV(filteredExports); // Use filteredExports instead of exportSummaries
    downloadCSV(csvContent, 'exports-data.csv');
  }, [filteredExports, generateExportsCSV]); // Update dependency

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: orgBranding.backgroundColor }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Management</h1>
          <p className="text-gray-600">
            Manage your coffee export requests and track their validation progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshExports}
            disabled={refreshLoading}
            className="flex items-center gap-2 border-[#7B2CBF] text-[#7B2CBF] hover:bg-[#7B2CBF] hover:text-white"
          >
            <RefreshIcon className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2 border-[#EFB80B] text-[#EFB80B] hover:bg-[#EFB80B] hover:text-white"
          >
            <DownloadIcon className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={() => navigate('/export/new')}
            className="flex items-center gap-2 bg-[#7B2CBF] hover:bg-[#5A189A] text-white"
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Stats Cards - now showing stats for current user only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exports</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalExports}</p>
              </div>
              <div className="p-2 rounded-full bg-[#7B2CBF] bg-opacity-20">
                <PlusIcon className="h-6 w-6 text-[#7B2CBF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Exports</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.activeExports}</p>
              </div>
              <div className="p-2 rounded-full bg-[#9D4EDD] bg-opacity-20">
                <RefreshIcon className="h-6 w-6 text-[#9D4EDD]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Validation</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.pendingValidation}</p>
              </div>
              <div className="p-2 rounded-full bg-[#5A189A] bg-opacity-20">
                <RefreshIcon className="h-6 w-6 text-[#5A189A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(userStats.totalValue, 'USD')}
                </p>
              </div>
              <div className="p-2 rounded-full bg-[#EFB80B] bg-opacity-20">
                <DownloadIcon className="h-6 w-6 text-[#EFB80B]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#F8F0FE]">
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
                  onClick={() => navigate('/export/new')}
                  className="flex items-center gap-2 mx-auto bg-[#7B2CBF] hover:bg-[#5A189A] text-white"
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
                    <input
                      type="text"
                      placeholder="Search exports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7B2CBF] focus:border-[#7B2CBF]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ExportStatus | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7B2CBF] focus:border-[#7B2CBF]"
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
                    className="flex items-center gap-2 border-[#7B2CBF] text-[#7B2CBF] hover:bg-[#7B2CBF] hover:text-white"
                  >
                    <FilterIcon className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exports Table - now showing only current user's exports */}
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
                      <TableRow key={exp.id} className="hover:bg-[#F8F0FE]">
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
                              className="flex items-center gap-1 text-[#7B2CBF] hover:bg-[#7B2CBF] hover:text-white"
                            >
                              <EyeIcon className="h-4 w-4" />
                              View
                            </Button>
                            {['DRAFT', 'REJECTED'].includes(exp.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExport(exp.id)}
                                className="flex items-center gap-1 text-[#7B2CBF] hover:bg-[#7B2CBF] hover:text-white"
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

export default React.memo(ExportManage);