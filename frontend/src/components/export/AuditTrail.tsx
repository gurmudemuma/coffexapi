import React, { useMemo } from 'react';
import { Card, CardContent, Button } from '../ui';
import { 
  History as HistoryIcon, 
  CheckCircle as CheckIcon, 
  Cancel as XIcon, 
  Schedule as ClockIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon
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
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            disabled={!hasEvents || loading}
            className="flex items-center gap-1.5"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1.5"
            >
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
            {/* Filter dropdown would go here */}
          </div>
        </div>
      </div>

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
              onClick={() => onFilterChange?.({})}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className={`border-l-4 ${
              event.status === 'success' ? 'border-green-500' :
              event.status === 'failed' ? 'border-red-500' :
              'border-yellow-500'
            } hover:shadow-md transition-shadow`}
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
                  >
                    View details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {hasEvents && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
