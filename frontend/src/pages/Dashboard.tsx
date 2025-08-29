import React, { useState, useEffect } from 'react';
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
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        ]
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

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
          <Button
            variant="contained"
            startIcon={<Download />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Documents
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
                    Pending Validation
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
                    Approved
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.approvedDocuments.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {approvalRate}% approval rate
                  </Typography>
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
                    Rejected
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.rejectedDocuments}
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    {((stats.rejectedDocuments / stats.totalDocuments) * 100).toFixed(1)}% rejection rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
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

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Validation Activity
                </Typography>
                <Button size="small" endIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Exporter</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Validator</TableCell>
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
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {user?.permissions.includes('regulatory:all') && (
                            <Tooltip title="Take Action">
                              <IconButton size="small">
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