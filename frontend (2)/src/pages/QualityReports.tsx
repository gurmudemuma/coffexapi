import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Avatar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Visibility,
  Download,
  Search,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Science,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { useNotifications } from '../contexts/NotificationContext';

interface QualityReport {
  id: string;
  reportNumber: string;
  exporterName: string;
  productType: string;
  sampleId: string;
  inspectionDate: string;
  inspector: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  qualityScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  certificateIssued: boolean;
}

const QualityReports: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: QualityReport[] = [
        {
          id: '1',
          reportNumber: 'QR-2024-001',
          exporterName: 'Ethiopia Coffee Co.',
          productType: 'Arabica Coffee Beans',
          sampleId: 'SAMPLE-001',
          inspectionDate: '2024-01-15',
          inspector: 'Quality Inspector Tesfaye Bekele',
          status: 'COMPLETED',
          qualityScore: 85,
          grade: 'A',
          certificateIssued: true
        },
        {
          id: '2',
          reportNumber: 'QR-2024-002',
          exporterName: 'Highland Coffee Ltd.',
          productType: 'Robusta Coffee Beans',
          sampleId: 'SAMPLE-002',
          inspectionDate: '2024-01-14',
          inspector: 'Quality Inspector Fatima Ali',
          status: 'IN_PROGRESS',
          qualityScore: 72,
          grade: 'B',
          certificateIssued: false
        },
        {
          id: '3',
          reportNumber: 'QR-2024-003',
          exporterName: 'Addis Export LLC',
          productType: 'Arabica Coffee Beans',
          sampleId: 'SAMPLE-003',
          inspectionDate: '2024-01-13',
          inspector: 'Quality Inspector Sara Mohammed',
          status: 'REJECTED',
          qualityScore: 45,
          grade: 'D',
          certificateIssued: false
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load quality reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'default';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'info';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'error';
      case 'F': return 'error';
      default: return 'default';
    }
  };

  const handleViewReport = (report: QualityReport) => {
    showNotification('info', 'View Report', `Viewing report ${report.reportNumber}`);
  };

  const handleDownloadReport = (report: QualityReport) => {
    showNotification('success', 'Download Started', `Downloading report ${report.reportNumber}`);
  };

  const handleGenerateReport = () => {
    showNotification('success', 'Report Created', 'New quality report has been created');
  };

  const reportStats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'PENDING').length,
    inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    completed: reports.filter(r => r.status === 'COMPLETED').length,
    approved: reports.filter(r => r.status === 'APPROVED').length,
    rejected: reports.filter(r => r.status === 'REJECTED').length
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quality Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchReports}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleGenerateReport}
          >
            Generate New Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reportStats.total}</Typography>
                  <Typography color="text.secondary">Total Reports</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reportStats.pending + reportStats.inProgress}</Typography>
                  <Typography color="text.secondary">In Progress</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reportStats.approved}</Typography>
                  <Typography color="text.secondary">Approved</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Error />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reportStats.rejected}</Typography>
                  <Typography color="text.secondary">Rejected</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Science />
                </Avatar>
                <Box>
                  <Typography variant="h6">{reports.filter(r => r.certificateIssued).length}</Typography>
                  <Typography color="text.secondary">Certificates Issued</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Table */}
      <Card>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report</TableCell>
                    <TableCell>Exporter & Product</TableCell>
                    <TableCell>Quality Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Inspector</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {report.reportNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(report.inspectionDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {report.exporterName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.productType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`${report.qualityScore}/100`}
                            color={report.qualityScore >= 80 ? 'success' : report.qualityScore >= 70 ? 'info' : report.qualityScore >= 60 ? 'warning' : 'error'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`Grade ${report.grade}`}
                            color={getGradeColor(report.grade) as any}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status.replace('_', ' ')}
                          color={getStatusColor(report.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {report.inspector.split(' ').slice(-2).join(' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewReport(report)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Report">
                            <IconButton size="small" onClick={() => handleDownloadReport(report)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QualityReports;
