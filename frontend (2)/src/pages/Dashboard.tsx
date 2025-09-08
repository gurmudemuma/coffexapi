import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  CheckCircle,
  Warning,
  Schedule,
  Coffee,
  Gavel,
  Visibility,
  Download,
  Refresh,
  Add,
  Payment,
  DocumentScanner,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Sector } from 'recharts';

interface DashboardStats {
  totalDocuments: number;
  pendingValidation: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  documentsToday: number;
  trendsData: {
    time: string;
    timestamp: number;
    documents: number;
    approved: number;
    pending: number;
    rejected: number;
  }[];
  recentActivity: any[];
  validationByType: any[];
  roleSpecificStats: {
    pendingActions: number;
    completedToday: number;
    upcomingDeadlines: number;
    alerts: string[];
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshRef = useRef(false);

  // Enhanced button handlers
  const handleViewAll = useCallback(() => {
    navigate('/audit');
  }, [navigate]);

  const handleTakeAction = useCallback((activityId: string, actionType: string) => {
    // Navigate to appropriate action page based on activity type
    switch (actionType) {
      case 'License Validation':
        navigate('/licenses');
        break;
      case 'Quality Certificate':
        navigate('/quality/reports');
        break;
      case 'Shipping Documents':
        navigate('/customs/shipments');
        break;
      case 'Invoice Validation':
        navigate('/bank/transactions');
        break;
      default:
        navigate('/compliance');
    }
  }, [navigate]);

  const handleViewDetails = useCallback((activityId: string) => {
    navigate(`/audit/${activityId}`);
  }, [navigate]);

  // Memoized data generation to prevent unnecessary recalculations
  const generateTrendsData = useCallback(() => {
    const data = [];
    const now = Date.now();
    // Generate data points for the last 24 hours
    for (let i = 23; i >= 0; i--) {
      const timestamp = now - i * 60 * 60 * 1000; // Hourly intervals
      const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Simulate blockchain transaction patterns with some randomness
      const baseDocuments = 15 + Math.floor(Math.random() * 10);
      const approved = Math.floor(baseDocuments * (0.7 + Math.random() * 0.2));
      const pending = Math.floor(baseDocuments * (0.2 + Math.random() * 0.1));
      const rejected = baseDocuments - approved - pending;
      
      data.push({
        time,
        timestamp,
        documents: baseDocuments,
        approved,
        pending,
        rejected
      });
    }
    return data;
  }, []);

  // Memoized role-specific stats generation
  const generateRoleSpecificStats = useCallback((role?: string) => {
    switch (role) {
      case 'NBE_ADMIN':
        return {
          pendingActions: 12,
          completedToday: 8,
          upcomingDeadlines: 4,
          alerts: ['3 license applications require immediate attention', 'Compliance audit due tomorrow']
        };
      case 'NBE_OFFICER':
        return {
          pendingActions: 12,
          completedToday: 8,
          upcomingDeadlines: 4,
          alerts: ['3 license applications require immediate attention', 'Compliance audit due tomorrow']
        };
      case 'CUSTOMS_VALIDATOR':
        return {
          pendingActions: 7,
          completedToday: 5,
          upcomingDeadlines: 1,
          alerts: ['2 shipping documents pending validation', 'Customs clearance deadline approaching']
        };
      case 'QUALITY_INSPECTOR':
        return {
          pendingActions: 9,
          completedToday: 6,
          upcomingDeadlines: 3,
          alerts: ['Quality inspection scheduled for tomorrow', '2 certificates need renewal']
        };
      case 'BANK_VALIDATOR':
        return {
          pendingActions: 6,
          completedToday: 4,
          upcomingDeadlines: 2,
          alerts: ['Payment processing queue: 6 invoices', 'Bank reconciliation due this week']
        };
      default:
        return {
          pendingActions: 0,
          completedToday: 0,
          upcomingDeadlines: 0,
          alerts: []
        };
    }
  }, []);

  // Memoized quick actions to prevent unnecessary recreations
  const getRoleSpecificQuickActions = useCallback(() => {
    switch (user?.role) {
      case 'NBE_ADMIN':
      case 'NBE_OFFICER':
        return [
          { label: 'Review Licenses', icon: <Security />, action: () => navigate('/licenses'), ariaLabel: 'Review licenses' },
          { label: 'Compliance Check', icon: <DocumentScanner />, action: () => navigate('/compliance'), ariaLabel: 'Perform compliance check' },
          { label: 'User Management', icon: <AccountBalance />, action: () => navigate('/users'), ariaLabel: 'Manage users' },
        ];
      case 'CUSTOMS_VALIDATOR':
        return [
          { label: 'Validate Shipping', icon: <DocumentScanner />, action: () => navigate('/customs/shipments'), ariaLabel: 'Validate shipping documents' },
          { label: 'Clearance Review', icon: <Security />, action: () => navigate('/customs/clearance'), ariaLabel: 'Review clearance requests' },
        ];
      case 'QUALITY_INSPECTOR':
        return [
          { label: 'Quality Inspection', icon: <DocumentScanner />, action: () => navigate('/quality/inspections'), ariaLabel: 'Perform quality inspections' },
          { label: 'Issue Certificate', icon: <Security />, action: () => navigate('/quality/certificates'), ariaLabel: 'Issue quality certificates' },
        ];
      case 'BANK_VALIDATOR':
        return [
          { label: 'Validate Invoice', icon: <DocumentScanner />, action: () => navigate('/bank/invoices'), ariaLabel: 'Validate invoices' },
          { label: 'Process Payment', icon: <Payment />, action: () => navigate('/bank/payments'), ariaLabel: 'Process payments' },
        ];
      default:
        return [];
    }
  }, [user?.role, navigate]);

  // Memoized status color and icon functions
  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Warning />;
      case 'pending':
        return <Schedule />;
      default:
        return <Assignment />;
    }
  }, []);

  // Custom function to get branding color based on status
  const getBrandingColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '#EFB80B'; // Gold for approved
      case 'rejected':
        return '#000000'; // Black for rejected
      case 'pending':
        return '#7B2CBF'; // Purple for pending
      default:
        return '#000000'; // Black for default
    }
  }, []);

  // Custom function to get background color based on status
  const getStatusBackgroundColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'rgba(239, 184, 11, 0.1)'; // Light gold
      case 'rejected':
        return 'rgba(0, 0, 0, 0.1)'; // Light black/gray
      case 'pending':
        return 'rgba(123, 44, 191, 0.1)'; // Light purple
      default:
        return 'rgba(0, 0, 0, 0.1)'; // Light black/gray
    }
  }, []);

  // Improved data fetching with better error handling
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with proper error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% chance of API error for testing
          if (Math.random() < 0.1) {
            reject(new Error('Failed to fetch dashboard data'));
          } else {
            resolve(null);
          }
        }, 500); // Reduced delay for better UX
      });
      
      // Generate role-specific stats
      const roleStats = generateRoleSpecificStats(user?.role);
      
      const mockStats: DashboardStats = {
        totalDocuments: 1247,
        pendingValidation: 23,
        approvedDocuments: 1156,
        rejectedDocuments: 68,
        documentsToday: 15,
        trendsData: generateTrendsData(),
        recentActivity: [
          {
            id: '1',
            type: 'License Validation',
            exporter: 'Ethiopia Coffee Co.',
            status: 'Approved',
            timestamp: '2 minutes ago',
            validator: 'NBE System'
          },
          {
            id: '2',
            type: 'Quality Certificate',
            exporter: 'Highland Coffee Ltd.',
            status: 'Pending',
            timestamp: '5 minutes ago',
            validator: 'Quality Authority'
          },
          {
            id: '3',
            type: 'Shipping Document',
            exporter: 'Addis Export LLC',
            status: 'Rejected',
            timestamp: '12 minutes ago',
            validator: 'Customs Authority'
          },
          {
            id: '4',
            type: 'Invoice Validation',
            exporter: 'Sidama Coffee Corp',
            status: 'Approved',
            timestamp: '18 minutes ago',
            validator: 'Commercial Bank'
          },
        ],
        validationByType: [
          { name: 'License', value: 425, color: '#7B2CBF' }, // Purple
          { name: 'Quality', value: 312, color: '#EFB80B' }, // Gold
          { name: 'Shipping', value: 287, color: '#000000' }, // Black
          { name: 'Invoice', value: 223, color: '#2C3CBF' }, // Dark Blue (CMYK-derived complementary color)
        ],
        roleSpecificStats: roleStats
      };
      
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [user?.role, generateRoleSpecificStats, generateTrendsData]);

  // Improved refresh function with loading state management
  const handleRefresh = useCallback(async () => {
    if (refreshRef.current) return; // Prevent multiple simultaneous refreshes
    
    refreshRef.current = true;
    try {
      await fetchDashboardData();
    } finally {
      refreshRef.current = false;
    }
  }, [fetchDashboardData]);

  // Improved function to handle pie chart segment click
  const handlePieSegmentClick = useCallback((data: any, index: number) => {
    if (!stats?.validationByType || index < 0 || index >= stats.validationByType.length) {
      setSelectedDocumentType(null);
      return;
    }
    
    const clickedItem = stats.validationByType[index];
    if (!clickedItem?.name) {
      setSelectedDocumentType(null);
      return;
    }
    
    // Toggle the filter - if same type is clicked again, clear filter
    setSelectedDocumentType(prevType => prevType === clickedItem.name ? null : clickedItem.name);
  }, [stats?.validationByType]);

  // Function to clear the filter
  const clearFilter = useCallback(() => {
    setSelectedDocumentType(null);
  }, []);

  // Memoized filtered stats based on selected document type
  const filteredStats = useMemo(() => {
    if (!stats || !selectedDocumentType) return stats;
    
    // Create a mapping for document type matching
    const typeMapping: Record<string, string[]> = {
      'License': ['License', 'License Validation', 'license'],
      'Quality': ['Quality', 'Quality Certificate', 'quality'],
      'Shipping': ['Shipping', 'Shipping Document', 'shipping'],
      'Invoice': ['Invoice', 'Invoice Validation', 'invoice']
    };
    
    // Get the matching terms for the selected type
    const matchingTerms = typeMapping[selectedDocumentType] || [selectedDocumentType];
    
    // Filter validation by type
    const filteredValidationByType = stats.validationByType.filter(item => 
      matchingTerms.some(term => 
        item.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    // Filter recent activity based on document type
    const filteredRecentActivity = stats.recentActivity.filter(activity => 
      matchingTerms.some(term => 
        activity.type.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    // Calculate filtered totals based on the actual filtered data
    const filteredTotal = filteredValidationByType.reduce((sum, item) => sum + item.value, 0);
    
    // Calculate ratios for proportional adjustments
    const totalOriginal = stats.validationByType.reduce((sum, item) => sum + item.value, 0);
    const ratio = totalOriginal > 0 ? filteredTotal / totalOriginal : 0;
    
    // Adjust role-specific stats based on filter
    const adjustedRoleStats = { ...stats.roleSpecificStats };
    if (selectedDocumentType === 'License') {
      // For licenses, adjust stats that are more relevant to licensing
      adjustedRoleStats.pendingActions = Math.max(1, Math.round(stats.roleSpecificStats.pendingActions * 0.7));
      adjustedRoleStats.completedToday = Math.max(1, Math.round(stats.roleSpecificStats.completedToday * 0.8));
      adjustedRoleStats.upcomingDeadlines = Math.max(0, Math.round(stats.roleSpecificStats.upcomingDeadlines * 0.5));
    } else if (selectedDocumentType === 'Quality') {
      adjustedRoleStats.pendingActions = Math.max(1, Math.round(stats.roleSpecificStats.pendingActions * 0.6));
      adjustedRoleStats.completedToday = Math.max(1, Math.round(stats.roleSpecificStats.completedToday * 0.7));
    } else if (selectedDocumentType === 'Shipping') {
      adjustedRoleStats.pendingActions = Math.max(1, Math.round(stats.roleSpecificStats.pendingActions * 0.5));
      adjustedRoleStats.completedToday = Math.max(1, Math.round(stats.roleSpecificStats.completedToday * 0.6));
    } else if (selectedDocumentType === 'Invoice') {
      adjustedRoleStats.pendingActions = Math.max(1, Math.round(stats.roleSpecificStats.pendingActions * 0.4));
      adjustedRoleStats.completedToday = Math.max(1, Math.round(stats.roleSpecificStats.completedToday * 0.5));
    }
    
    // Filter alerts based on document type
    let filteredAlerts = [...stats.roleSpecificStats.alerts];
    if (selectedDocumentType === 'License') {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.toLowerCase().includes('license') || alert.toLowerCase().includes('application')
      );
    } else if (selectedDocumentType === 'Quality') {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.toLowerCase().includes('quality') || alert.toLowerCase().includes('certificate')
      );
    } else if (selectedDocumentType === 'Shipping') {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.toLowerCase().includes('shipping') || alert.toLowerCase().includes('customs') || 
        alert.toLowerCase().includes('document')
      );
    } else if (selectedDocumentType === 'Invoice') {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.toLowerCase().includes('invoice') || alert.toLowerCase().includes('payment') ||
        alert.toLowerCase().includes('bank')
      );
    }
    
    // Filter trends data to show only relevant information
    // For now, we'll keep the trends data but highlight that it's filtered
    const filteredTrendsData = stats.trendsData.map(point => ({
      ...point,
      // We could modify the data here to reflect filtered trends if needed
    }));
    
    return {
      ...stats,
      totalDocuments: filteredTotal,
      pendingValidation: Math.round(stats.pendingValidation * ratio),
      approvedDocuments: Math.round(stats.approvedDocuments * ratio),
      rejectedDocuments: Math.round(stats.rejectedDocuments * ratio),
      documentsToday: Math.round(stats.documentsToday * ratio),
      validationByType: filteredValidationByType,
      recentActivity: filteredRecentActivity,
      trendsData: filteredTrendsData,
      roleSpecificStats: {
        ...adjustedRoleStats,
        alerts: filteredAlerts
      }
    };
  }, [stats, selectedDocumentType]);

  // Use filtered stats if available, otherwise use original stats
  const displayStats = filteredStats || stats;

  // Initialize dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    return () => {
      // Cleanup interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDashboardData]);

  // Set up interval for real-time data simulation with proper cleanup
  useEffect(() => {
    if (!stats) return;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up new interval
    intervalRef.current = setInterval(() => {
      setStats(prevStats => {
        if (!prevStats) return null;
        
        const updatedTrends = [...prevStats.trendsData];
        const lastIndex = updatedTrends.length - 1;
        
        // Simulate new blockchain transactions
        const lastPoint = updatedTrends[lastIndex];
        const newDocuments = lastPoint.documents + Math.floor(Math.random() * 3) - 1; // -1 to +1 variation
        const approved = Math.max(0, lastPoint.approved + Math.floor(Math.random() * 3) - 1);
        const pending = Math.max(0, lastPoint.pending + Math.floor(Math.random() * 2) - 1);
        const rejected = Math.max(0, newDocuments - approved - pending);
        
        updatedTrends[lastIndex] = {
          ...lastPoint,
          documents: Math.max(0, newDocuments),
          approved,
          pending,
          rejected
        };
        
        return {
          ...prevStats,
          trendsData: updatedTrends
        };
      });
    }, 5000); // Update every 5 seconds to simulate real-time blockchain updates
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stats]);

  // Memoized calculations to prevent unnecessary recalculations
  const approvalRate = useMemo(() => {
    if (!stats) return '0.0';
    return ((stats.approvedDocuments / stats.totalDocuments) * 100).toFixed(1);
  }, [stats?.approvedDocuments, stats?.totalDocuments]);

  const todayChange = useMemo(() => {
    if (!stats) return '0';
    return stats.documentsToday > 0 ? '+' + stats.documentsToday : '0';
  }, [stats?.documentsToday]);

  // Memoized quick actions to prevent unnecessary recreations
  const quickActions = useMemo(() => getRoleSpecificQuickActions(), [getRoleSpecificQuickActions]);

  if (loading && !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Dashboard
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{
            backgroundColor: '#7B2CBF',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#5A189A',
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography variant="h6" gutterBottom>
          No dashboard data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#7B2CBF' }}>
            Welcome back, {user?.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#000000' }}>
            {user?.organization} - {user?.role}
            {selectedDocumentType && (
              <Chip 
                label={`Filtered by: ${selectedDocumentType}`} 
                size="small" 
                sx={{ 
                  ml: 2, 
                  backgroundColor: '#7B2CBF', 
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(123, 44, 191, 0.3)'
                }}
                onDelete={clearFilter}
              />
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              borderColor: '#7B2CBF',
              color: '#7B2CBF',
              '&:hover': {
                backgroundColor: '#7B2CBF',
                color: '#FFFFFF',
                borderColor: '#7B2CBF',
              }
            }}
            aria-label="Refresh dashboard data"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => console.log('Export report functionality would be implemented here')}
            sx={{
              backgroundColor: '#EFB80B',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#D8A500',
              }
            }}
            aria-label="Export dashboard report"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Role-Specific Alerts */}
      {displayStats?.roleSpecificStats?.alerts && displayStats.roleSpecificStats.alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {displayStats.roleSpecificStats.alerts.map((alert, index) => (
            <Alert 
              key={index} 
              severity="info" 
              sx={{ 
                mb: 1,
                backgroundColor: selectedDocumentType ? '#F8F0FE' : '#F8F0FE',
                border: '1px solid #7B2CBF',
                '& .MuiAlert-icon': {
                  color: '#7B2CBF',
                },
                boxShadow: selectedDocumentType ? '0 0 8px rgba(123, 44, 191, 0.2)' : 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>
                  {selectedDocumentType && (
                    <Box component="span" sx={{ 
                      display: 'inline-block', 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#7B2CBF', 
                      mr: 1 
                    }} />
                  )}
                </Box>
                {alert}
                {selectedDocumentType && (
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    ml: 1, 
                    px: 1, 
                    py: 0.5, 
                    backgroundColor: 'rgba(123, 44, 191, 0.1)', 
                    borderRadius: 1, 
                    fontSize: '0.75rem', 
                    color: '#7B2CBF' 
                  }}>
                    {selectedDocumentType} Related
                  </Box>
                )}
              </Box>
            </Alert>
          ))}
        </Box>
      )}

      {/* Quick Actions for Current Role */}
      <Card sx={{ 
        mb: 3, 
        border: '1px solid #7B2CBF', 
        boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
        backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>
              Quick Actions
              {selectedDocumentType && (
                <Typography component="span" sx={{ display: 'block', fontSize: '0.9rem', color: '#7B2CBF', fontWeight: 'normal' }}>
                  Filtered for {selectedDocumentType}
                </Typography>
              )}
            </Typography>
            {selectedDocumentType && (
              <Button 
                size="small" 
                onClick={clearFilter}
                sx={{ 
                  color: '#7B2CBF',
                  borderColor: '#7B2CBF',
                  '&:hover': {
                    backgroundColor: '#7B2CBF',
                    color: '#FFFFFF',
                  }
                }}
                variant="outlined"
              >
                Clear Filter
              </Button>
            )}
          </Box>
          <Grid container spacing={2}>
            {getRoleSpecificQuickActions().map((action, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{
                    minWidth: 150,
                    borderColor: '#7B2CBF',
                    color: '#7B2CBF',
                    '&:hover': {
                      backgroundColor: '#7B2CBF',
                      color: '#FFFFFF',
                      borderColor: '#7B2CBF',
                    },
                    backgroundColor: selectedDocumentType ? 'rgba(123, 44, 191, 0.1)' : 'transparent'
                  }}
                  aria-label={action.ariaLabel}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #7B2CBF', 
            boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
            backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                    Total Documents
                    {selectedDocumentType && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                        {selectedDocumentType} Only
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                    {displayStats?.totalDocuments.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ mr: 0.5, color: '#EFB80B' }} />
                    <Typography variant="body2" sx={{ color: '#EFB80B' }}>
                      {displayStats?.documentsToday && displayStats.documentsToday > 0 ? '+' + displayStats.documentsToday : '0'} today
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: '#7B2CBF' }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #EFB80B', 
            boxShadow: '0 0 10px rgba(239, 184, 11, 0.1)',
            backgroundColor: selectedDocumentType ? '#FFFCF0' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                    Pending Validation
                    {selectedDocumentType && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                        {selectedDocumentType} Only
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                    {displayStats?.pendingValidation}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#EFB80B' }}>
                    Requires attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#EFB80B', color: '#000000' }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #7B2CBF', 
            boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
            backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                    Approved Documents
                    {selectedDocumentType && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                        {selectedDocumentType} Only
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                    {displayStats?.approvedDocuments}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#000000' }}>
                      {displayStats ? ((displayStats.approvedDocuments / (displayStats.totalDocuments || 1)) * 100).toFixed(1) : '0.0'}% approval rate
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: '#7B2CBF' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #000000', 
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: selectedDocumentType ? '#F0F0F0' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                    Rejected Documents
                    {selectedDocumentType && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                        {selectedDocumentType} Only
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                    {displayStats?.rejectedDocuments}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    Requires review
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#000000', color: '#FFFFFF' }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Role-Specific Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #7B2CBF', 
            boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
            backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                Pending Actions
                {selectedDocumentType && (
                  <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                    {selectedDocumentType} Related
                  </Typography>
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#EFB80B' }}>
                {displayStats?.roleSpecificStats.pendingActions}
              </Typography>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                Require your attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #EFB80B', 
            boxShadow: '0 0 10px rgba(239, 184, 11, 0.1)',
            backgroundColor: selectedDocumentType ? '#FFFCF0' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                Completed Today
                {selectedDocumentType && (
                  <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                    {selectedDocumentType} Related
                  </Typography>
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                {displayStats?.roleSpecificStats.completedToday}
              </Typography>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                Tasks finished
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #000000', 
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: selectedDocumentType ? '#F0F0F0' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                Upcoming Deadlines
                {selectedDocumentType && (
                  <Typography component="span" sx={{ display: 'block', fontSize: '0.8rem', color: '#7B2CBF', fontWeight: 'bold' }}>
                    {selectedDocumentType} Related
                  </Typography>
                )}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                {displayStats?.roleSpecificStats.upcomingDeadlines}
              </Typography>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                Due this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            border: '1px solid #7B2CBF', 
            boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
            backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF',
            transform: selectedDocumentType ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ color: '#000000' }}>
                System Status
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
                All Systems
              </Typography>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                Operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ border: '1px solid #7B2CBF', boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>
                  Document Validation Trends
                  {selectedDocumentType && (
                    <Typography component="span" sx={{ display: 'block', fontSize: '0.9rem', color: '#7B2CBF', fontWeight: 'normal' }}>
                      Showing trends for {selectedDocumentType}
                    </Typography>
                  )}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#7B2CBF', borderRadius: '50%', mr: 1 }}></Box>
                    <Typography variant="caption">Total Documents</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#EFB80B', borderRadius: '50%', mr: 1 }}></Box>
                    <Typography variant="caption">Approved Documents</Typography>
                  </Box>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayStats?.trendsData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#000000" 
                    tick={{ fontSize: 12, fill: '#000000' }}
                    interval={3}
                  />
                  <YAxis stroke="#000000" tick={{ fontSize: 12, fill: '#000000' }} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #7B2CBF',
                      borderRadius: '4px',
                      boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)'
                    }}
                    formatter={(value, name) => {
                      switch (name) {
                        case 'documents': return [value, 'Total Documents'];
                        case 'approved': return [value, 'Approved'];
                        default: return [value, name];
                      }
                    }}
                    labelStyle={{ color: '#7B2CBF', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="documents" 
                    stroke="#7B2CBF" 
                    strokeWidth={selectedDocumentType ? 4 : 3}
                    dot={{ stroke: '#7B2CBF', strokeWidth: selectedDocumentType ? 3 : 2, r: selectedDocumentType ? 5 : 4 }}
                    activeDot={{ r: 6, stroke: '#5A189A' }}
                    name="Total Documents"
                    style={{
                      filter: selectedDocumentType ? 'drop-shadow(0 0 2px rgba(123, 44, 191, 0.5))' : 'none'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    stroke="#EFB80B" 
                    strokeWidth={selectedDocumentType ? 4 : 3}
                    dot={{ stroke: '#EFB80B', strokeWidth: selectedDocumentType ? 3 : 2, r: selectedDocumentType ? 5 : 4 }}
                    activeDot={{ r: 6, stroke: '#D8A500' }}
                    name="Approved Documents"
                    style={{
                      filter: selectedDocumentType ? 'drop-shadow(0 0 2px rgba(239, 184, 11, 0.5))' : 'none'
                    }}
                  />
                  {/* Blockchain validation status indicator */}
                  <text 
                    x="50%" 
                    y="20" 
                    textAnchor="middle" 
                    fill="#7B2CBF" 
                    fontSize={14} 
                    fontWeight="bold"
                  >
                    Real-time Blockchain Validation
                  </text>
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#F8F0FE', borderRadius: '4px' }}>
                <Typography variant="body2" sx={{ color: '#5A189A', fontWeight: 'bold' }}>
                  🔗 Blockchain Status: 
                  <Box component="span" sx={{ color: '#7B2CBF', ml: 1 }}>
                    All transactions validated and recorded on blockchain
                    {selectedDocumentType && ` (${selectedDocumentType} only)`}
                  </Box>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ border: '1px solid #7B2CBF', boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>
                  Validation by Type
                </Typography>
                {selectedDocumentType && (
                  <Button 
                    size="small" 
                    onClick={clearFilter}
                    sx={{ color: '#7B2CBF' }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={displayStats?.validationByType || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#2C3CBF"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    onClick={handlePieSegmentClick}
                    activeIndex={selectedDocumentType ? displayStats?.validationByType.findIndex(item => item.name === selectedDocumentType) : -1}
                    activeShape={(props: any) => {
                      const RADIAN = Math.PI / 180;
                      const {
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        startAngle,
                        endAngle,
                        fill,
                        payload,
                        percent,
                        value
                      } = props;
                      const sin = Math.sin(-RADIAN * midAngle);
                      const cos = Math.cos(-RADIAN * midAngle);
                      const sx = cx + (outerRadius + 10) * cos;
                      const sy = cy + (outerRadius + 10) * sin;
                      const mx = cx + (outerRadius + 30) * cos;
                      const my = cy + (outerRadius + 30) * sin;
                      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                      const ey = my;
                      const textAnchor = cos >= 0 ? 'start' : 'end';

                      return (
                        <g>
                          <path
                            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                            stroke={fill}
                            fill="none"
                          />
                          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                          <text
                            x={ex + (cos >= 0 ? 1 : -1) * 12}
                            y={ey}
                            textAnchor={textAnchor}
                            fill="#000000"
                            fontSize={14}
                          >
                            {`${value} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                          <Sector
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius}
                            outerRadius={outerRadius + 10}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            fill={fill}
                            stroke="#7B2CBF"
                            strokeWidth={3}
                          />
                        </g>
                      );
                    }}
                  >
                    {displayStats?.validationByType.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={selectedDocumentType === entry.name ? '#7B2CBF' : '#000000'}
                        strokeWidth={selectedDocumentType === entry.name ? 3 : 1}
                        style={{
                          filter: selectedDocumentType === entry.name 
                            ? 'drop-shadow(0 0 4px rgba(123, 44, 191, 0.5))' 
                            : 'none',
                          cursor: 'pointer',
                          transform: selectedDocumentType === entry.name ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #7B2CBF',
                      borderRadius: '4px',
                      boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  ✅ All validations secured by blockchain technology
                </Typography>
                {!selectedDocumentType ? (
                  <Typography component="span" sx={{ display: 'block', color: '#7B2CBF', mt: 1, fontWeight: 'bold' }}>
                    🔍 Click on a segment to filter dashboard data
                  </Typography>
                ) : (
                  <Typography component="span" sx={{ display: 'block', color: '#7B2CBF', mt: 1, fontWeight: 'bold' }}>
                    🔄 Showing data for {selectedDocumentType} only. Click the same segment or "Clear" to reset.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ 
            border: '1px solid #7B2CBF', 
            boxShadow: '0 0 10px rgba(123, 44, 191, 0.1)',
            backgroundColor: selectedDocumentType ? '#F8F0FE' : '#FFFFFF'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>
                  Recent Validation Activity
                  {selectedDocumentType && (
                    <Typography component="span" sx={{ display: 'block', fontSize: '0.9rem', color: '#7B2CBF', fontWeight: 'normal' }}>
                      Showing {selectedDocumentType} validations
                    </Typography>
                  )}
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<Visibility />} 
                  onClick={handleViewAll}
                  sx={{
                    color: '#7B2CBF',
                    borderColor: '#7B2CBF',
                    '&:hover': {
                      backgroundColor: '#7B2CBF',
                      color: '#FFFFFF',
                    }
                  }}
                  variant="outlined"
                >
                  View All
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ 
                boxShadow: 'none',
                border: selectedDocumentType ? '1px solid #7B2CBF' : '1px solid #000000'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F8F0FE' }}>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Document Type</TableCell>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Exporter</TableCell>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Validator</TableCell>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ color: '#7B2CBF', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayStats?.recentActivity.map((activity) => (
                      <TableRow 
                        key={activity.id} 
                        hover 
                        sx={{ 
                          '&:hover': { backgroundColor: '#F8F0FE' },
                          backgroundColor: selectedDocumentType ? 'rgba(123, 44, 191, 0.05)' : 'transparent',
                          borderLeft: selectedDocumentType ? '3px solid #7B2CBF' : 'none'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Coffee sx={{ mr: 1, color: '#7B2CBF' }} />
                            {activity.type}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#000000' }}>{activity.exporter}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(activity.status)}
                            label={activity.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusBackgroundColor(activity.status),
                              color: getBrandingColor(activity.status),
                              borderColor: getBrandingColor(activity.status),
                              borderWidth: 1,
                              borderStyle: 'solid',
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: getBrandingColor(activity.status),
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#000000' }}>{activity.validator}</TableCell>
                        <TableCell sx={{ color: '#000000' }}>{activity.timestamp}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetails(activity.id)}
                              sx={{
                                color: '#7B2CBF',
                                '&:hover': {
                                  backgroundColor: '#7B2CBF',
                                  color: '#FFFFFF',
                                }
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {user?.permissions.includes('regulatory:all') && (
                            <Tooltip title="Take Action">
                              <IconButton 
                                size="small" 
                                onClick={() => handleTakeAction(activity.id, activity.type)}
                                sx={{
                                  color: '#000000',
                                  '&:hover': {
                                    backgroundColor: '#000000',
                                    color: '#FFFFFF',
                                  },
                                  ml: 1
                                }}
                              >
                                <Gavel />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;