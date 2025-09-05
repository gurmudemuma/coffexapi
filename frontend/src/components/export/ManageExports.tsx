import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Button, 
  Badge, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  Skeleton,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '../ui';
import { FormInput as Input, Select } from '../ui/FormComponents';
import { 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  LocalShipping as ShippingIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  SwapVert as SortIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Coffee as CoffeeIcon
} from '@mui/icons-material';
import { ExportSummary, ExportStatus } from '../../types/export';

interface ManageExportsProps {
  exports: ExportSummary[];
  loading?: boolean;
  onViewExport: (id: string) => void;
  onEditExport: (id: string) => void;
  onCreateNew: () => void;
  onRefresh?: () => void;
  onExportData?: () => void;
  className?: string;
}

type SortField = 'exportId' | 'submittedAt' | 'productType' | 'totalValue' | 'status';
type SortDirection = 'asc' | 'desc';

export const ManageExports: React.FC<ManageExportsProps> = ({
  exports,
  loading = false,
  onViewExport,
  onEditExport,
  onCreateNew,
  onRefresh,
  onExportData,
  className = ''
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExportStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: 'submittedAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: ExportStatus) => {
    switch (status) {
      case 'DRAFT': return 'bg-blue-100 text-blue-800';
      case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800';
      case 'VALIDATING': return 'bg-purple-100 text-purple-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PAYMENT_RELEASED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeVariant = (status: ExportStatus) => {
    switch (status) {
      case 'DRAFT': return 'secondary';
      case 'SUBMITTED': return 'default';
      case 'VALIDATING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      case 'PAYMENT_RELEASED': return 'success';
      default: return 'default';
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortExports = (items: ExportSummary[]) => {
    return [...items].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.field) {
        case 'exportId':
          aValue = a.exportId?.toLowerCase() || '';
          bValue = b.exportId?.toLowerCase() || '';
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        case 'submittedAt':
          aValue = a.submittedAt || 0;
          bValue = b.submittedAt || 0;
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
          
        case 'productType':
          aValue = a.productType?.toLowerCase() || '';
          bValue = b.productType?.toLowerCase() || '';
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
            
        case 'totalValue':
          aValue = a.totalValue || 0;
          bValue = b.totalValue || 0;
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
          
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
            
        default:
          return 0;
      }
    });
  };

  const filteredExports = useMemo(() => {
    let result = [...exports];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(exp => 
        exp.exportId?.toLowerCase().includes(term) ||
        exp.productType?.toLowerCase().includes(term) ||
        exp.destination?.toLowerCase().includes(term) ||
        exp.status?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(exp => exp.status === statusFilter);
    }
    
    // Apply sorting
    return sortExports(result);
  }, [exports, searchTerm, statusFilter, sortConfig]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredExports.length / rowsPerPage);
  const paginatedExports = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredExports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredExports, currentPage]);
  
  const statusOptions: Array<{ value: ExportStatus | 'all', label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'VALIDATING', label: 'Validating' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'PAYMENT_RELEASED', label: 'Payment Released' }
  ];

  // Convert to the format expected by the Select component
  const selectOptions = statusOptions.map(option => ({
    value: option.value,
    label: option.label
  }));

  // Enhanced button handlers
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default refresh behavior - reload the page data
      window.location.reload();
    }
  };

  const handleExportData = () => {
    if (onExportData) {
      onExportData();
    } else {
      // Default export behavior - download filtered data as CSV
      const filteredData = filteredExports;
      const csvContent = generateCSV(filteredData);
      downloadCSV(csvContent, 'exports-data.csv');
    }
  };

  const handleViewExport = (id: string) => {
    if (onViewExport) {
      onViewExport(id);
    } else {
      navigate(`/exports/${id}`);
    }
  };

  const handleEditExport = (id: string) => {
    if (onEditExport) {
      onEditExport(id);
    } else {
      navigate(`/exports/${id}/edit`);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      navigate('/export/new');
    }
  };

  // CSV generation and download functions
  const generateCSV = (data: ExportSummary[]) => {
    const headers = ['Export ID', 'Product', 'Quantity', 'Value', 'Destination', 'Status', 'Submitted'];
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
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (exports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CoffeeIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h4 className="text-xl font-semibold mb-3 text-gray-700">No Export Requests Yet</h4>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start your coffee export journey! Create your first export request and track its progress through our blockchain-validated system.
        </p>
        <Button 
          variant="default" 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          New Export Request
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Manage Exports</h2>
            <p className="text-muted-foreground">View, edit, and track your export submissions</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={onCreateNew} className="flex items-center gap-2">
              <AddIcon className="h-4 w-4" />
              New Export
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshIcon className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onExportData}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              placeholder="Search exports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<SearchIcon className="h-4 w-4" />}
              className="w-full"
            />
          </div>
          
          <div>
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ExportStatus | 'all')}
              options={selectOptions}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('exportId')}
                >
                  <div className="flex items-center gap-1">
                    Export ID
                    <SortIcon className={`h-4 w-4 ${
                      sortConfig.field === 'exportId' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                  </div>
                </TableHead>
              
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('productType')}
                >
                  <div className="flex items-center gap-1">
                    Product
                    <SortIcon className={`h-4 w-4 ${
                      sortConfig.field === 'productType' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                  </div>
                </TableHead>
              
                <TableHead className="text-right">Quantity</TableHead>
              
                <TableHead 
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('totalValue')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <SortIcon className={`h-4 w-4 ${
                      sortConfig.field === 'totalValue' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    Value
                  </div>
                </TableHead>
              
                <TableHead>Destination</TableHead>
              
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon className={`h-4 w-4 ${
                      sortConfig.field === 'status' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                  </div>
                </TableHead>
              
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('submittedAt')}
                >
                  <div className="flex items-center gap-1">
                    Submitted
                    <SortIcon className={`h-4 w-4 ${
                      sortConfig.field === 'submittedAt' ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                  </div>
                </TableHead>
              
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExports.map((exp) => (
                <TableRow key={exp.exportId}>
                  <TableCell className="font-medium">{exp.exportId}</TableCell>
                  <TableCell>{exp.productType}</TableCell>
                  <TableCell>{formatDate(exp.submittedAt)}</TableCell>
                  <TableCell>{formatCurrency(exp.totalValue, exp.currency)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(exp.status)}>
                      {exp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewExport(exp.exportId)}
                      >
                        <ViewIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditExport(exp.exportId)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, filteredExports.length)}
                </span>{' '}
                of <span className="font-medium">{filteredExports.length}</span> exports
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <Button
                          variant={currentPage === pageNum ? 'default' : 'ghost'}
                          className={`w-10 h-10 p-0 ${currentPage === pageNum ? 'font-bold' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
