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
  AccountBalance,
  TrendingUp,
  Schedule,
  Warning,
  Security,
  Refresh,
  Download,
  Assignment,
  Gavel,
} from '@mui/icons-material';
import {
  StandardButton as Button,
  StandardCard as Card,
  StandardCardContent as CardContent,
  Alert,
  StandardBadge as Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../components/ui';
import { useAuth } from '../store';
import ApproversPanel from '../components/ApproversPanel';
import { useDashboardTitle } from '../hooks/useOrganizationTitle';

// Add the organization branding import
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface NBEDashboardStats {
  totalLicenses: number;
  activeLicenses: number;
  expiringSoon: number;
  violationsDetected: number;
  complianceRate: number;
}

const NBEDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<NBEDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Use organization-specific title and branding
  const { dashboardTitle, description, orgBranding } = useDashboardTitle();
  
  // Fallback branding if orgBranding is null
  const safeOrgBranding = orgBranding || {
    name: 'National Bank of Ethiopia',
    fullName: 'National Bank of Ethiopia',
    subtitle: 'Financial License Validation Portal',
    description: 'Secure validation and approval of export licenses and financial documentation for Ethiopian coffee exports',
    dashboardTitle: 'License Validation Dashboard',
    portalType: 'Banking Authority',
    primaryColor: '#8B4513', // Coffee Brown
    secondaryColor: '#D2691E', // Chocolate Brown
    accentColor: '#FFD700', // Gold (from original bank colors)
    backgroundColor: '#f8f9fa', // Light gray
    textColor: '#000000',
    logoColor: '#8B4513', // Coffee Brown
    chartColors: ['#8B4513', '#D2691E', '#FFD700', '#A0522D', '#CD853F'], // Coffee-themed palette
    gradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
    boxShadow: '0 4px 6px rgba(139, 69, 19, 0.1)'
  };

  // Enhanced button handlers
  const handleManageLicenses = () => {
    // Navigate to license management page
    navigate('/licenses');
  };

  const handleViewCompliance = () => {
    // Navigate to compliance monitoring page
    navigate('/compliance');
  };

  const handleTakeAction = () => {
    // Navigate to enforcement actions page
    navigate('/compliance');
  };

  const handleViewLicenseDetails = (licenseId: string) => {
    navigate(`/licenses`);
  };

  const handleDownloadLicense = (licenseId: string) => {
    // Generate and download license document
    const licenseData = {
      licenseId,
      timestamp: new Date().toISOString(),
      authority: 'The Mint',
      // Add more license data as needed
    };
    
    const licenseContent = generateLicense(licenseData);
    downloadLicense(licenseContent, `license-${licenseId}.txt`);
  };

  // License generation and download functions
  const generateLicense = (data: any) => {
    return `
      EXPORT LICENSE
      ==============
      License ID: ${data.licenseId}
      Authority: ${data.authority}
      Date: ${new Date(data.timestamp).toLocaleString()}
      
      This license authorizes the export of coffee products
      in accordance with NBE regulations and requirements.
      
      Issued by: ${user?.name || 'N/A'}
      Organization: ${user?.organization || 'N/A'}
      Role: ${user?.role || 'N/A'}
      
      Valid until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
    `;
  };

  const downloadLicense = (content: string, filename: string) => {
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



  useEffect(() => {
    fetchNBEData();
  }, []);

  const fetchNBEData = async () => {
    setLoading(true);
    try {
      // Fetch NBE-specific data with organization filtering
      const response = await fetch(`http://localhost:8000/api/nbe-dashboard-stats?org=national-bank`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Organization': 'national-bank',
          'X-User-Role': user?.role || '',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.organization === 'National Bank of Ethiopia') {
          setStats(data.data.stats);
        } else {
          // Fallback to organization-specific mock data
          throw new Error('Invalid organization data received');
        }
      } else {
        throw new Error('Failed to fetch NBE data');
      }
    } catch (error) {
      console.error('Error fetching NBE dashboard data:', error);
      // Fallback to NBE-specific mock data (only for NBE users)
      if (user?.organization === 'National Bank of Ethiopia') {
        const nbeSpecificStats: NBEDashboardStats = {
          totalLicenses: 2847,
          activeLicenses: 2689,
          expiringSoon: 23,
          violationsDetected: 12,
          complianceRate: 96.8,
        };
        setStats(nbeSpecificStats);
      } else {
        // If user is not from NBE, show empty stats as security measure
        setStats({
          totalLicenses: 0,
          activeLicenses: 0,
          expiringSoon: 0,
          violationsDetected: 0,
          complianceRate: 0,
        });
      }
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading NBE Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: safeOrgBranding.backgroundColor, minHeight: '100vh', p: 3 }}>
      {/* NBE Header with enhanced branding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: safeOrgBranding.primaryColor, width: 56, height: 56, mr: 2 }}>
            <AccountBalance sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: safeOrgBranding.primaryColor, mb: 0 }}>
              {safeOrgBranding.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Regulatory Control Center - Welcome, {user?.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outline" 
            icon={<Refresh />} 
            onClick={fetchNBEData}
          >
            Refresh Data
          </Button>
          <Button 
            variant="primary" 
            icon={<Download />} 
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* NBE Key Metrics with enhanced branding */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${safeOrgBranding.primaryColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Licenses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: safeOrgBranding.primaryColor }}>
                    {stats.totalLicenses.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      {stats.activeLicenses} active
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: safeOrgBranding.primaryColor }}>
                  <AccountBalance />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${safeOrgBranding.accentColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Expiring Soon
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: safeOrgBranding.accentColor }}>
                    {stats.expiringSoon}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Requires attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: safeOrgBranding.accentColor }}>
                  <Schedule />
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
                    Violations Detected
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {stats.violationsDetected}
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    Immediate action required
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#d32f2f' }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${safeOrgBranding.chartColors[3]}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Compliance Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: safeOrgBranding.chartColors[3] }}>
                    {stats.complianceRate}%
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Above target (95%)
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: safeOrgBranding.chartColors[3] }}>
                  <Security />
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
              License Validation
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Regulatory Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="0">
            {/* Overview Tab Content */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card variant="outline">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 600 }}>
                      Recent Regulatory Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor coffee export license activities and regulatory compliance for National Bank of Ethiopia operations.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button variant="outline">
                        View All Actions
                      </Button>
                      <Button variant="primary">
                        Take Action
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outline">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 600 }}>
                      System Alerts
                    </Typography>
                    {/* NBE-specific alerts only */}
                    {stats && stats.expiringSoon > 0 && (
                      <Alert variant="warning" className="mb-2">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          License Expiration Alert
                        </Typography>
                        <Typography variant="body2">
                          {stats.expiringSoon} export licenses expiring within 30 days require review
                        </Typography>
                      </Alert>
                    )}
                    {stats && stats.violationsDetected > 0 && (
                      <Alert variant="error">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Compliance Violation
                        </Typography>
                        <Typography variant="body2">
                          {stats.violationsDetected} new regulatory violations require immediate action
                        </Typography>
                      </Alert>
                    )}
                    {(!stats || (stats.expiringSoon === 0 && stats.violationsDetected === 0)) && (
                      <Alert variant="success">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          NBE Operations Status
                        </Typography>
                        <Typography variant="body2">
                          All NBE license operations are running smoothly
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabsContent>

          <TabsContent value="1">
            {/* License Validation Panel */}
            <Box className="bg-white rounded-lg p-6">
              <ApproversPanel organizationType="national-bank" />
            </Box>
          </TabsContent>

          <TabsContent value="2">
            {/* Regulatory Actions Panel */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outline">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 600 }}>
                      Regulatory Actions Center
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      NBE-specific regulatory enforcement actions, compliance monitoring, and license management activities for The Mint jurisdiction.
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Card variant="outline" className="bg-blue-50 border-[#1565c0]">
                          <CardContent>
                            <Typography variant="h6" sx={{ color: '#1565c0', mb: 2 }}>
                              License Management
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              • Process NBE export license applications\n• Monitor NBE regulatory compliance\n• Handle NBE license renewals and extensions
                            </Typography>
                            <Button variant="primary" size="sm" onClick={handleManageLicenses}>
                              Manage Licenses
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Card variant="outline" className="bg-orange-50 border-orange-500">
                          <CardContent>
                            <Typography variant="h6" sx={{ color: '#f57c00', mb: 2 }}>
                              Compliance Monitoring
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              • NBE real-time violation detection\n• NBE automated compliance checks\n• NBE regulatory risk assessments
                            </Typography>
                            <Button variant="primary" size="sm" onClick={handleViewCompliance}>
                              View Compliance
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Card variant="outline" className="bg-red-50 border-red-500">
                          <CardContent>
                            <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2 }}>
                              Enforcement Actions
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              • Issue NBE violations and penalties\n• NBE license suspension and revocation\n• NBE investigation management
                            </Typography>
                            <Button variant="primary" size="sm" onClick={handleTakeAction}>
                              Take Action
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabsContent>
        </Tabs>
      </Card>
    </Box>
  );
};

export default NBEDashboard;