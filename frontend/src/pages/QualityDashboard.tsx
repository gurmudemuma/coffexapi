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
  VerifiedUser,
  TrendingUp,
  Schedule,
  Warning,
  Star,
  Refresh,
  Download,
  Science,
  Assignment,
  VerifiedOutlined,
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
import ApproversPanel from '../components/ApproversPanel';

// Add the organization branding import
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface QualityDashboardStats {
  totalSamples: number;
  pendingInspection: number;
  certificatesIssued: number;
  rejectionRate: number;
  avgQualityScore: number;
}

const QualityDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<QualityDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Enhanced button handlers
  const handleGenerateReport = () => {
    // Generate quality report and navigate to reports page
    navigate('/quality/reports');
  };

  const handleExportData = () => {
    // Export quality data as CSV/Excel
    if (stats) {
      const csvContent = generateQualityCSV(stats);
      downloadCSV(csvContent, 'quality-data.csv');
    }
  };

  const handleViewSampleDetails = (sampleId: string) => {
    navigate(`/quality/reports`);
  };

  const handleDownloadCertificate = (sampleId: string) => {
    // Generate and download quality certificate
    const certificateData = {
      sampleId,
      timestamp: new Date().toISOString(),
      authority: 'Coffee Quality Authority',
      // Add more certificate data as needed
    };
    
    const certificateContent = generateCertificate(certificateData);
    downloadCertificate(certificateContent, `certificate-${sampleId}.txt`);
  };

  // CSV generation and download functions
  const generateQualityCSV = (data: any) => {
    const headers = ['Sample ID', 'Quality Score', 'Status', 'Inspector', 'Date'];
    const rows = [
      ['Sample-001', data.avgQualityScore, 'Approved', 'Inspector A', new Date().toLocaleDateString()],
      ['Sample-002', data.avgQualityScore, 'Pending', 'Inspector B', new Date().toLocaleDateString()],
      // Add more sample data as needed
    ];
    
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

  // Certificate generation and download functions
  const generateCertificate = (data: any) => {
    return `
      COFFEE QUALITY CERTIFICATE
      ==========================
      Sample ID: ${data.sampleId}
      Authority: ${data.authority}
      Date: ${new Date(data.timestamp).toLocaleString()}
      
      This certificate confirms that the coffee sample
      has been inspected and meets quality standards.
      
      Quality Score: ${stats?.avgQualityScore || 'N/A'}/10
      
      Inspector: ${user?.name || 'N/A'}
      Organization: ${user?.organization || 'N/A'}
    `;
  };

  const downloadCertificate = (content: string, filename: string) => {
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
  const orgBranding = ORGANIZATION_BRANDING['quality-authority'];

  useEffect(() => {
    fetchQualityData();
  }, []);

  const fetchQualityData = async () => {
    setLoading(true);
    try {
      // Fetch Quality Authority-specific data with organization filtering
      const response = await fetch(`http://localhost:8000/api/quality-dashboard-stats?org=quality-authority`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Organization': 'quality-authority',
          'X-User-Role': user?.role || '',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.organization === 'Coffee Quality Authority') {
          setStats(data.data.stats);
        } else {
          throw new Error('Invalid organization data received');
        }
      } else {
        throw new Error('Failed to fetch Quality Authority data');
      }
    } catch (error) {
      console.error('Error fetching Quality dashboard data:', error);
      // Fallback to Quality Authority-specific mock data (only for Quality Authority users)
      if (user?.organization === 'Coffee Quality Authority') {
        const qualitySpecificStats: QualityDashboardStats = {
          totalSamples: 1456,
          pendingInspection: 34,
          certificatesIssued: 1389,
          rejectionRate: 4.6,
          avgQualityScore: 8.7,
        };
        setStats(qualitySpecificStats);
      } else {
        // If user is not from Quality Authority, show empty stats as security measure
        setStats({
          totalSamples: 0,
          pendingInspection: 0,
          certificatesIssued: 0,
          rejectionRate: 0,
          avgQualityScore: 0,
        });
      }
    }
    setLoading(false);
  };

  const getQualityStars = (score: number) => {
    return Math.round(score / 2); // Convert 10-point scale to 5-star rating
  };

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading Quality Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: orgBranding.backgroundColor, minHeight: '100vh', p: 3 }}>
      {/* Quality Authority Header with enhanced branding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: orgBranding.primaryColor, width: 56, height: 56, mr: 2 }}>
            <VerifiedUser sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: orgBranding.primaryColor, mb: 0 }}>
              Coffee Quality Authority
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Quality Certification Center - Welcome, {user?.name}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outline"
            icon={<Refresh />}
            onClick={fetchQualityData}
            className={`border-[${orgBranding.primaryColor}] text-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.primaryColor}] hover:text-white`}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            icon={<Download />}
            className={`bg-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.secondaryColor}]`}
          >
            Export Certificates
          </Button>
        </Box>
      </Box>

      {/* Quality Key Metrics with enhanced branding */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.primaryColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Samples
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.primaryColor }}>
                    {stats.totalSamples.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      {stats.certificatesIssued} certified
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.primaryColor }}>
                  <Science />
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
                    Pending Inspection
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.accentColor }}>
                    {stats.pendingInspection}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Awaiting inspection
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
          <Card variant="outline" className={`border-2 border-[${orgBranding.chartColors[3]}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg. Quality Score
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.chartColors[3] }}>
                    {stats.avgQualityScore}/10
                  </Typography>
                  <Rating 
                    value={getQualityStars(stats.avgQualityScore)} 
                    readOnly 
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.chartColors[3] }}>
                  <Star />
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
                    Rejection Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {stats.rejectionRate}%
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    Quality control measure
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

      {/* Tabs for Quality Dashboard */}
      <Card variant="outline" className="mb-4">
        <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0" className="flex items-center gap-2">
              <Assignment className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="1" className="flex items-center gap-2">
              <VerifiedOutlined className="h-4 w-4" />
              Certificate Validation
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <LocalOffer className="h-4 w-4" />
              Quality Reports
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        /* Quality Control Actions and Alerts */
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#7b1fa2', fontWeight: 600 }}>
                  Recent Quality Inspections
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor Coffee Quality Authority-specific sample inspections and certification processes for export quality compliance.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outline" className="mr-2 border-[#7b1fa2] text-[#7b1fa2]">
                    View All Inspections
                  </Button>
                  <Button variant="primary" className="bg-[#388e3c]">
                    Issue Certificate
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#7b1fa2', fontWeight: 600 }}>
                  Quality Alerts - Coffee Quality Authority
                </Typography>
                {stats && stats.pendingInspection > 0 && (
                  <Alert variant="warning" className="mb-2">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      CQA Pending Inspections
                    </Typography>
                    <Typography variant="body2">
                      {stats.pendingInspection} coffee samples awaiting CQA quality inspection
                    </Typography>
                  </Alert>
                )}
                {stats && stats.avgQualityScore > 0 && (
                  <Alert variant="info">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      CQA Quality Standards
                    </Typography>
                    <Typography variant="body2">
                      Average CQA quality score: {stats.avgQualityScore}/10 - {stats.avgQualityScore >= 8 ? 'Excellent' : stats.avgQualityScore >= 6 ? 'Good' : 'Needs Improvement'}
                    </Typography>
                  </Alert>
                )}
                {(!stats || (stats.pendingInspection === 0 && stats.avgQualityScore === 0)) && (
                  <Alert variant="success">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      CQA Operations Status
                    </Typography>
                    <Typography variant="body2">
                      All Coffee Quality Authority operations are running smoothly
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        /* Quality Certificate Validation */
        <Box>
          <ApproversPanel organizationType="quality-authority" />
        </Box>
      )}

      {activeTab === 2 && (
        /* Quality Reports */
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#7b1fa2', fontWeight: 600 }}>
                  Quality Reports & Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Coffee Quality Authority comprehensive quality reports and statistical analysis of coffee samples processed by CQA.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                        {stats.certificatesIssued}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Certificates Issued
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                        {(100 - stats.rejectionRate).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Approval Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                        {getQualityStars(stats.avgQualityScore)}/5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Star Rating
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                        {stats.pendingInspection}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Reviews
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="outline" className="border-[#7b1fa2] text-[#7b1fa2]" onClick={handleGenerateReport}>
                    Generate Report
                  </Button>
                  <Button variant="primary" className="bg-[#7b1fa2]" onClick={handleExportData}>
                    Export Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default QualityDashboard;