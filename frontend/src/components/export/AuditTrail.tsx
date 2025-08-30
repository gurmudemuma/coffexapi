import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '../ui';
import { 
  History as HistoryIcon, 
  CheckCircle as CheckIcon, 
  Cancel as XIcon, 
  Schedule as ClockIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  X as CloseIcon
} from '@mui/icons-material';
import { AuditEvent } from '../../types/export';

interface AuditTrailProps {
  events: AuditEvent[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
  filterOptions?: {
    status?: Array<'success' | 'pending' | 'failed'>;
    dateRange?: {
      start: Date;
      end: Date;
    };
    searchTerm?: string;
  };
  onFilterChange?: (filters: any) => void;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  events,
  loading = false,
  onRefresh,
  onExport,
  className = '',
  filterOptions,
  onFilterChange
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: filterOptions?.status || [],
    dateRange: filterOptions?.dateRange || { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() },
    searchTerm: filterOptions?.searchTerm || ''
  });
  const [displayCount, setDisplayCount] = useState(20);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XIcon className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Enhanced button handlers
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default refresh behavior
      window.location.reload();
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export behavior - download filtered data as CSV
      const csvContent = generateCSV(filteredEvents);
      downloadCSV(csvContent, 'audit-trail.csv');
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = { status: [], dateRange: { start: new Date(), end: new Date() }, searchTerm: '' };
    setLocalFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(`/audit/${eventId}`);
  };

  // CSV generation and download functions
  const generateCSV = (data: AuditEvent[]) => {
    const headers = ['Timestamp', 'Action', 'Performed By', 'Status', 'Details'];
    const rows = data.map(event => [
      formatDate(event.timestamp),
      event.action,
      event.performedBy,
      event.status,
      event.details || ''
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredEvents = useMemo(() => {
    if (!filterOptions) return events;
    
    return events.filter(event => {
      // Filter by status if specified
      if (filterOptions.status && filterOptions.status.length > 0) {
        if (!filterOptions.status.includes(event.status)) return false;
      }
      
      // Filter by date range if specified
      if (filterOptions?.dateRange) {
        const eventDate = new Date(event.timestamp);
        if (eventDate < filterOptions.dateRange.start || eventDate > filterOptions.dateRange.end) {
          return false;
        }
      }
      
      // Filter by search term if specified
      if (filterOptions?.searchTerm) {
        const searchLower = filterOptions.searchTerm.toLowerCase();
        const matchesSearch = 
          event.action.toLowerCase().includes(searchLower) ||
          event.performedBy.toLowerCase().includes(searchLower) ||
          (event.details && event.details.toLowerCase().includes(searchLower));
          
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [events, filterOptions]);
  
  const hasEvents = filteredEvents.length > 0;
  const displayedEvents = filteredEvents.slice(0, displayCount);
  const hasMoreEvents = displayedEvents.length < filteredEvents.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-gray-500" />
          <h2 className="text-xl font-bold">Audit Trail</h2>
          <span className="text-sm bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={!hasEvents || loading}
            className="flex items-center gap-1.5"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5"
          >
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {['success', 'pending', 'failed'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={localFilters.status.includes(status as any)}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? [...localFilters.status, status]
                            : localFilters.status.filter(s => s !== status);
                          handleFilterChange({ ...localFilters, status: newStatus });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={localFilters.dateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDateRange = {
                        ...localFilters.dateRange,
                        start: new Date(e.target.value)
                      };
                      handleFilterChange({ ...localFilters, dateRange: newDateRange });
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    value={localFilters.dateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDateRange = {
                        ...localFilters.dateRange,
                        end: new Date(e.target.value)
                      };
                      handleFilterChange({ ...localFilters, dateRange: newDateRange });
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={localFilters.searchTerm}
                  onChange={(e) => {
                    handleFilterChange({ ...localFilters, searchTerm: e.target.value });
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="mr-2"
              >
                Clear Filters
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasEvents && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            {filterOptions?.searchTerm || filterOptions?.status?.length ? 'No matching events found' : 'No audit events found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterOptions?.searchTerm || filterOptions?.status?.length 
              ? 'Try adjusting your filters or search term.'
              : 'Audit trail will appear here as actions are taken on your exports.'}
          </p>
          {(filterOptions?.searchTerm || filterOptions?.status?.length) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {displayedEvents.map((event) => (
          <Card 
            key={event.id} 
            className={`border-l-4 ${
              event.status === 'success' ? 'border-green-500' :
              event.status === 'failed' ? 'border-red-500' :
              'border-yellow-500'
            } hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => handleViewDetails(event.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(event.status)}
                    <h4 className="font-medium text-gray-900 truncate">{event.action}</h4>
                  </div>
                  
                  {event.details && (
                    <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                      {event.details}
                    </p>
                  )}
                  
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>{formatDate(event.timestamp)}</span>
                    <span className="hidden sm:inline-block">•</span>
                    <span className="font-medium">{event.performedBy}</span>
                    <span className="hidden sm:inline-block">•</span>
                    <span className="capitalize">{event.status}</span>
                  </div>
                </div>
                
                {event.details && event.details.length > 100 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-primary-600 hover:bg-primary-50 self-end sm:self-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(event.id);
                    }}
                  >
                    View details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {hasMoreEvents && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
