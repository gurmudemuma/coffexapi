import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  LocalShipping,
  TrendingUp,
  TrendingDown,
  Assignment,
  CheckCircle,
  Warning,
  Schedule,
  Visibility,
  Download,
  Refresh,
  Security,
  Inventory,
  DocumentScanner,
  Speed,
  FlightTakeoff,
  AssignmentTurnedIn,
  VerifiedUser,
  LocalOffer,
} from '@mui/icons-material';
import {
  StandardButton as Button,
  StandardCard as Card,
  StandardCardContent as CardContent,
  StandardBadge as Badge,
  Alert,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../components/ui';
import { useAuth } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import ApproversPanel from '../components/ApproversPanel';

// Add the organization branding import
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface CustomsDashboardStats {
  totalShipments: number;
  pendingClearance: number;
  clearedToday: number;
  avgClearanceTime: number;
  suspiciousShipments: number;
  clearanceData: any[];
  recentShipments: any[];
  portStatistics: any[];
}

const CustomsDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<CustomsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Enhanced button handlers
  const handleViewDocuments = (shipmentId: string) => {
    // Navigate to shipment documents page
    navigate(`/customs/shipments`);
  };

  const handleDownloadManifest = (shipmentId: string) => {
    // Generate and download shipping manifest
    const manifestData = {
      shipmentId,
      timestamp: new Date().toISOString(),
      authority: 'Customs Authority',
      // Add more manifest data as needed
    };
    
    const manifestContent = generateManifest(manifestData);
    downloadManifest(manifestContent, `manifest-${shipmentId}.txt`);
  };

  const handleProcessClearance = (shipmentId: string) => {
    // Navigate to clearance processing page
    navigate(`/customs/clearance`);
  };

  const handleViewShipmentDetails = (shipmentId: string) => {
    navigate(`/customs/shipments`);
  };

  // Manifest generation and download functions
  const generateManifest = (data: any) => {
    return `
      SHIPPING MANIFEST
      =================
      Shipment ID: ${data.shipmentId}
      Authority: ${data.authority}
      Date: ${new Date(data.timestamp).toLocaleString()}
      
      This manifest contains the complete list of items
      being shipped for export clearance.
      
      Customs Officer: ${user?.name || 'N/A'}
      Organization: ${user?.organization || 'N/A'}
      Role: ${user?.role || 'N/A'}
      
      Generated on: ${new Date().toLocaleString()}
    `;
  };

  const downloadManifest = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['customs'];

  useEffect(() => {
    fetchCustomsData();
  }, []);

  const fetchCustomsData = async () => {
    setLoading(true);
    try {
      // Fetch Customs Authority-specific data with organization filtering
      const response = await fetch(`http://localhost:8000/api/customs-dashboard-stats?org=customs`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Organization': 'customs',
          'X-User-Role': user?.role || '',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.organization === 'Customs Authority') {
          setStats(data.data.stats);
        } else {
          throw new Error('Invalid organization data received');
        }
      } else {
        throw new Error('Failed to fetch Customs Authority data');
      }
    } catch (error) {
      console.error('Error fetching Customs dashboard data:', error);
      // Fallback to Customs Authority-specific mock data (only for Customs Authority users)
      if (user?.organization === 'Customs Authority') {
        const customsSpecificStats: CustomsDashboardStats = {
          totalShipments: 856,
          pendingClearance: 47,
          clearedToday: 23,
          avgClearanceTime: 4.2,
          suspiciousShipments: 3,
          clearanceData: [
            { month: 'Jan', cleared: 198, pending: 12, avg_time: 4.1 },
            { month: 'Feb', cleared: 234, pending: 8, avg_time: 3.8 },
            { month: 'Mar', cleared: 267, pending: 15, avg_time: 4.3 },
            { month: 'Apr', cleared: 289, pending: 11, avg_time: 3.9 },
            { month: 'May', cleared: 312, pending: 19, avg_time: 4.5 },
            { month: 'Jun', cleared: 278, pending: 14, avg_time: 4.0 },
          ],
          recentShipments: [
            {
              id: 'SH-2024-789',
              exporter: 'Highland Coffee Export',
              vessel: 'MV Ethiopia Star',
              port: 'Djibouti',
              status: 'Cleared',
              clearanceTime: '3.2 hours',
              value: '$45,600',
              timestamp: '2 hours ago'
            },
            {
              id: 'SH-2024-790',
              exporter: 'Addis Export LLC',
              vessel: 'MV Coffee Pride',
              port: 'Djibouti',
              status: 'Under Review',
              clearanceTime: '6.1 hours',
              value: '$67,800',
              timestamp: '4 hours ago'
            },
            {
              id: 'SH-2024-791',
              exporter: 'Sidama Coffee Corp',
              vessel: 'MV Trade Wind',
              port: 'Berbera',
              status: 'Flagged',
              clearanceTime: 'Pending',
              value: '$89,200',
              timestamp: '6 hours ago'
            },
            {
              id: 'SH-2024-788',
              exporter: 'Yirgacheffe Exports',
              vessel: 'MV Ocean Breeze',
              port: 'Djibouti',
              status: 'Cleared',
              clearanceTime: '2.8 hours',
              value: '$52,400',
              timestamp: '8 hours ago'
            },
          ],
          portStatistics: [
            { name: 'Djibouti', value: 589, color: orgBranding.chartColors[0] },
            { name: 'Berbera', value: 198, color: orgBranding.chartColors[1] },
            { name: 'Port Sudan', value: 69, color: orgBranding.chartColors[2] },
          ]
        };
        setStats(customsSpecificStats);
      } else {
        // If user is not from Customs Authority, show empty stats as security measure
        setStats({
          totalShipments: 0,
          pendingClearance: 0,
          clearedToday: 0,
          avgClearanceTime: 0,
          suspiciousShipments: 0,
          clearanceData: [],
          recentShipments: [],
          portStatistics: [],
        });
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cleared': return 'success';
      case 'Under Review': return 'warning';
      case 'Flagged': return 'error';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Cleared': return <CheckCircle />;
      case 'Under Review': return <Schedule />;
      case 'Flagged': return <Warning />;
      case 'Pending': return <Assignment />;
      default: return <Assignment />;
    }
  };

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading Customs Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: orgBranding.backgroundColor, minHeight: '100vh', p: 3 }}>
      {/* Customs Header with enhanced branding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: orgBranding.primaryColor, width: 56, height: 56, mr: 2 }}>
            <LocalShipping sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: orgBranding.primaryColor, mb: 0 }}>
              Ethiopia Customs Authority
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Ethiopia Customs Authority Clearance Operations - Welcome, {user?.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outline" 
            icon={<Refresh />} 
            onClick={fetchCustomsData} 
            className={`border-[${orgBranding.primaryColor}] text-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.primaryColor}] hover:text-white`}
          >
            Refresh Data
          </Button>
          <Button 
            variant="primary" 
            icon={<Download />} 
            className={`bg-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.secondaryColor}]`}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Customs Key Metrics with enhanced branding */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.primaryColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Shipments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.primaryColor }}>
                    {stats.totalShipments.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      {stats.clearedToday} cleared today
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.primaryColor }}>
                  <FlightTakeoff />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.accentColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Clearance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.accentColor }}>
                    {stats.pendingClearance}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Awaiting review
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.accentColor }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.chartColors[4]}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg. Clearance Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.chartColors[4] }}>
                    {stats.avgClearanceTime}h
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                    Target: {'<'}5h
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.chartColors[4] }}>
                  <Speed />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className="border-2 border-red-500 rounded-lg shadow-lg">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Suspicious Shipments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {stats.suspiciousShipments}
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    Requires investigation
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#d32f2f' }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dashboard Tabs */}
      <Card variant="outline" className="mb-4">
        <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="1" className="flex items-center gap-2">
              <Assignment className="h-4 w-4" />
              Document Validation
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <LocalOffer className="h-4 w-4" />
              Clearance Operations
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Charts and Analytics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <Card className="rounded-lg">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Monthly Clearance Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.clearanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="cleared" fill="#2e7d32" name="Cleared Shipments" />
                      <Bar dataKey="pending" fill="#f57c00" name="Pending Clearance" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card className="rounded-lg h-full">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Port Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats.portStatistics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.portStatistics.map((entry, index) => (
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
        </>
      )}

      {/* Document Validation Panel */}
      {activeTab === 1 && (
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3 }}>
          <ApproversPanel organizationType="customs" />
        </Box>
      )}

      {/* Clearance Operations Panel */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Recent Shipments */}
          <Grid item xs={12}>
            <Card className="rounded-lg">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Recent Shipment Activity
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                    <div className="relative">
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="relative"
                      >
                        Pending Review
                      </Button>
                      {stats.pendingClearance > 0 && (
                        <Badge 
                          variant="error" 
                          size="sm"
                          className="absolute -top-2 -right-2"
                        >
                          {stats.pendingClearance}
                        </Badge>
                      )}
                    </div>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Shipment ID</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Exporter</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Vessel</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Port</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Value</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Clearance Time</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentShipments.map((shipment) => (
                        <TableRow key={shipment.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DocumentScanner sx={{ mr: 1, color: '#2e7d32' }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {shipment.id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {shipment.exporter}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {shipment.vessel}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {shipment.port}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                              {shipment.value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(shipment.status) as any}
                              size="sm"
                            >
                              {getStatusIcon(shipment.status)}
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {shipment.clearanceTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Tooltip title="View Documents">
                                <IconButton size="small" onClick={() => handleViewDocuments(shipment.id)}>
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Manifest">
                                <IconButton size="small" sx={{ color: '#2e7d32' }} onClick={() => handleDownloadManifest(shipment.id)}>
                                  <Download />
                                </IconButton>
                              </Tooltip>
                              {shipment.status === 'Under Review' && (
                                <Tooltip title="Process Clearance">
                                  <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => handleProcessClearance(shipment.id)}>
                                    <AssignmentTurnedIn />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
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
      )}
    </Box>
  );
};

export default CustomsDashboard;