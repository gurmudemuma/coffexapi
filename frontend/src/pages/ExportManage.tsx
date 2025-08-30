import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { useExports, type ExportStatus } from '../hooks/useExports';
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



type ExportSummary = {
  id: string;
  exportId: string;
  productType: string;
  quantity: number;
  totalValue: number;
  currency: string;
  destination: string;
  status: ExportStatus;
  submittedAt?: number;
  validationProgress: number;
};

const ExportManage: React.FC = () => {
  const { user } = useAuth();
  const { exportSummaries, stats, loading, error } = useExports();
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
    navigate(`/exports/${exportId}`);
  }, [navigate]);

  const handleEditExport = useCallback((exportId: string) => {
    navigate(`/exports/${exportId}/edit`);
  }, [navigate]);

  const handleCreateNewExport = useCallback(() => {
    setActiveTab('new-export');
  }, []);

  const handleRefreshExports = useCallback(async () => {
    setRefreshLoading(true);
    try {
      // In a real app, you'd fetch fresh data from the API
      // Removed artificial delay for better performance
      console.log('Exports refreshed');
    } catch (err) {
      console.error('Failed to refresh exports:', err);
    } finally {
      setRefreshLoading(false);
    }
  }, []);

  const handleExportData = useCallback(() => {
    // Export exports data as CSV
    const csvContent = generateExportsCSV(exportSummaries);
    downloadCSV(csvContent, 'exports-data.csv');
  }, [exportSummaries]);

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

  // Memoized filtered exports for better performance
  const filteredExports = useMemo(() => {
    return exportSummaries.filter((exp: any) => {
      const matchesSearch = 
        exp.exportId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.productType.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        exp.destination.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || exp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [exportSummaries, debouncedSearchTerm, statusFilter]);

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
          {error.message}
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
            className="flex items-center gap-2"
          >
            <RefreshIcon className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={handleCreateNewExport}
            className="flex items-center gap-2"
            style={{ backgroundColor: orgBranding.primaryColor }}
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExports}</p>
              </div>
              <div className="p-2 rounded-full" style={{ backgroundColor: orgBranding.primaryColor + '20' }}>
                <PlusIcon className="h-6 w-6" style={{ color: orgBranding.primaryColor }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Exports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeExports}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <RefreshIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Validation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingValidation}</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <RefreshIcon className="h-6 w-6 text-yellow-600" />
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
                  {formatCurrency(stats.totalValue, 'USD')}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <DownloadIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-export">Create New Export</TabsTrigger>
          <TabsTrigger value="manage">Manage Exports</TabsTrigger>
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
                  onClick={() => navigate('/exports/new')}
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
                    <input
                      type="text"
                      placeholder="Search exports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ExportStatus | 'ALL')}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                         filteredExports.map((exp: any) => (
                      <TableRow key={exp.id} className="hover:bg-gray-50">
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
                                className="bg-blue-600 h-2 rounded-full"
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