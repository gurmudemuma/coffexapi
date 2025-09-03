import React, { useState, useEffect } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalDocuments: number;
  pendingValidation: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  documentsToday: number;
  trendsData: any[];
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

  // Check if user is an exporter
  const isExporter = user?.organization === 'Coffee Exporters Association' && user?.role === 'EXPORTER';

  // Enhanced button handlers
  const handleViewAll = () => {
    // For exporters, navigate to their export management page instead of audit trail
    if (isExporter) {
      navigate('/export/manage');
    } else {
      navigate('/audit');
    }
  };

  const handleTakeAction = (activityId: string, actionType: string) => {
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
        // For exporters, navigate to export management instead of compliance
        if (isExporter) {
          navigate('/export/manage');
        } else {
          navigate('/compliance');
        }
    }
  };

  const handleViewDetails = (activityId: string) => {
    // For exporters, navigate to export details instead of audit details
    if (isExporter) {
      navigate(`/exports/${activityId}`);
    } else {
      navigate(`/audit/${activityId}`);
    }
  };

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate role-specific stats
      const roleStats = generateRoleSpecificStats(user?.role);
      
      const mockStats: DashboardStats = {
        totalDocuments: 1247,
        pendingValidation: 23,
        approvedDocuments: 1156,
        rejectedDocuments: 68,
        documentsToday: 15,
        trendsData: [
          { month: 'Jan', documents: 98, approved: 92 },
          { month: 'Feb', documents: 112, approved: 107 },
          { month: 'Mar', documents: 134, approved: 125 },
          { month: 'Apr', documents: 156, approved: 148 },
          { month: 'May', documents: 189, approved: 176 },
          { month: 'Jun', documents: 167, approved: 159 },
        ],
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
          { name: 'License', value: 425, color: '#1976d2' },
          { name: 'Quality', value: 312, color: '#388e3c' },
          { name: 'Shipping', value: 287, color: '#f57c00' },
          { name: 'Invoice', value: 223, color: '#7b1fa2' },
        ],
        roleSpecificStats: roleStats
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    fetchDashboardData();
  }, [user?.role]);

  const generateRoleSpecificStats = (role?: string) => {
    switch (role) {
      case 'EXPORTER':
        return {
          pendingActions: 5,
          completedToday: 3,
          upcomingDeadlines: 2,
          // Simplified alerts for exporters without compliance-related messages
          alerts: ['Payment request pending approval', 'Quality certificate expires in 7 days']
        };
      case 'NBE_ADMIN':
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
  };

  const getStatusColor = (status: string) => {
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
  };

  const getStatusIcon = (status: string) => {
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
  };

  const getRoleSpecificQuickActions = () => {
    switch (user?.role) {
      case 'EXPORTER':
        return [
          { label: 'New Export Request', icon: <Add />, action: () => navigate('/export/new') },
          { label: 'Manage Exports', icon: <DocumentScanner />, action: () => navigate('/export/manage') },
          { label: 'Request Payment', icon: <Payment />, action: () => console.log('Payment') },
        ];
      case 'NBE_ADMIN':
      case 'NBE_OFFICER':
        return [
          { label: 'Review Licenses', icon: <Security />, action: () => console.log('Review') },
          // Only show Compliance Check for non-exporters
          ...(!isExporter ? [{ label: 'Compliance Check', icon: <DocumentScanner />, action: () => console.log('Compliance') }] : []),
          { label: 'User Management', icon: <AccountBalance />, action: () => console.log('Users') },
        ];
      case 'CUSTOMS_VALIDATOR':
        return [
          { label: 'Validate Shipping', icon: <DocumentScanner />, action: () => console.log('Shipping') },
          { label: 'Clearance Review', icon: <Security />, action: () => console.log('Clearance') },
        ];
      case 'QUALITY_INSPECTOR':
        return [
          { label: 'Quality Inspection', icon: <DocumentScanner />, action: () => console.log('Quality') },
          { label: 'Issue Certificate', icon: <Security />, action: () => console.log('Certificate') },
        ];
      case 'BANK_VALIDATOR':
        return [
          { label: 'Validate Invoice', icon: <DocumentScanner />, action: () => console.log('Invoice') },
          { label: 'Process Payment', icon: <Payment />, action: () => console.log('Payment') },
        ];
      default:
        return [];
    }
  };

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  const approvalRate = ((stats.approvedDocuments / stats.totalDocuments) * 100).toFixed(1);
  const todayChange = stats.documentsToday > 0 ? '+' + stats.documentsToday : '0';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome back, {user?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.organization} - {user?.role}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          {/* Hide export report button for exporters */}
          {!isExporter && (
            <Button
              variant="contained"
              startIcon={<Download />}
            >
              Export Report
            </Button>
          )}
        </Box>
      </Box>

      {/* Role-Specific Alerts */}
      {stats.roleSpecificStats.alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {stats.roleSpecificStats.alerts.map((alert, index) => (
            <Alert key={index} severity="info" sx={{ mb: 1 }}>
              {alert}
            </Alert>
          ))}
        </Box>
      )}

      {/* Quick Actions for Current Role */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {getRoleSpecificQuickActions().map((action, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{ minWidth: 150 }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics Cards - Show simplified version for exporters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {isExporter ? 'Total Exports' : 'Total Documents'}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalDocuments.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      {todayChange} today
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {isExporter ? 'Pending Exports' : 'Pending Validation'}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.pendingValidation}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Requires attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {isExporter ? 'Approved Exports' : 'Approved Documents'}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.approvedDocuments}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {approvalRate}% approval rate
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {isExporter ? 'Total Value' : 'Rejected Documents'}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {isExporter ? '$45,000' : stats.rejectedDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isExporter ? 'Combined export value' : 'Requires review'}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: isExporter ? 'info.main' : 'error.main' }}>
                  {isExporter ? <Coffee /> : <Warning />}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Role-Specific Stats - Hide for exporters */}
      {!isExporter && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Pending Actions
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {stats.roleSpecificStats.pendingActions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Require your attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completed Today
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {stats.roleSpecificStats.completedToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasks finished
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Upcoming Deadlines
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {stats.roleSpecificStats.upcomingDeadlines}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due this week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  System Status
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  All Systems
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Operational
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Section - Hide for exporters */}
      {!isExporter && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Document Validation Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="documents" stroke="#1976d2" strokeWidth={2} />
                    <Line type="monotone" dataKey="approved" stroke="#388e3c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Validation by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.validationByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.validationByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Activity - Simplified for exporters */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {isExporter ? 'Recent Exports' : 'Recent Validation Activity'}
                </Typography>
                <Button size="small" endIcon={<Visibility />} onClick={handleViewAll}>
                  {isExporter ? 'Manage Exports' : 'View All'}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{isExporter ? 'Export Details' : 'Document Type'}</TableCell>
                      <TableCell>{isExporter ? 'Destination' : 'Exporter'}</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>{isExporter ? 'Created' : 'Validator'}</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentActivity.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Coffee sx={{ mr: 1, color: 'primary.main' }} />
                            {activity.type}
                          </Box>
                        </TableCell>
                        <TableCell>{activity.exporter}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(activity.status)}
                            label={activity.status}
                            color={getStatusColor(activity.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{activity.validator}</TableCell>
                        <TableCell>{activity.timestamp}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewDetails(activity.id)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {/* Hide regulatory actions for exporters */}
                          {!isExporter && user?.permissions.includes('regulatory:all') && (
                            <Tooltip title="Take Action">
                              <IconButton 
                                size="small" 
                                onClick={() => handleTakeAction(activity.id, activity.type)}
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