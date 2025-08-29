import React, { useState, useMemo } from 'react';
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
  Input,
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
import { Select } from '../ui/FormComponents';
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
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <AddIcon className="mr-2 h-4 w-4" />
          New Export Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Export Requests</h2>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshIcon className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
              <TableRow key={exp.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="truncate max-w-[120px] inline-block">
                          {exp.exportId}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{exp.exportId}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                
                <TableCell className="capitalize">
                  {exp.productType?.toLowerCase() || 'N/A'}
                </TableCell>
                
                <TableCell className="text-right">
                  {exp.quantity?.toLocaleString() || '0'}
                </TableCell>
                
                <TableCell className="text-right font-medium">
                  {exp.currency && exp.totalValue 
                    ? formatCurrency(exp.totalValue, exp.currency)
                    : 'N/A'}
                </TableCell>
                
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="truncate max-w-[120px] inline-block">
                          {exp.destination || 'N/A'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{exp.destination || 'N/A'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(exp.status)}
                    className={getStatusColor(exp.status)}
                  >
                    {exp.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm text-gray-600">
                          {exp.submittedAt ? formatDate(exp.submittedAt) : 'N/A'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{new Date(exp.submittedAt || 0).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewExport(exp.id)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-primary-600"
                          >
                            <ViewIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditExport(exp.id)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-primary-600"
                            disabled={!['DRAFT', 'REJECTED'].includes(exp.status)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit export</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
    </div>
  );
};
