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
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Alert,
  LinearProgress,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Download,
  Search,
  FilterList,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Business,
  Assignment,
  Schedule,
  Gavel,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { useNotifications } from '../contexts/NotificationContext';

interface License {
  id: string;
  licenseNumber: string;
  exporterName: string;
  exporterId: string;
  productType: string;
  quantity: number;
  unit: string;
  totalValue: number;
  currency: string;
  destination: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING_RENEWAL';
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  lastRenewalDate?: string;
  notes?: string;
}

const LicenseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    exporterName: '',
    productType: '',
    quantity: '',
    unit: 'kg',
    totalValue: '',
    currency: 'USD',
    destination: '',
    expiryDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLicenses: License[] = [
        {
          id: '1',
          licenseNumber: 'EL-2024-001',
          exporterName: 'Ethiopia Coffee Co.',
          exporterId: 'EXP-001',
          productType: 'Arabica Coffee Beans',
          quantity: 50000,
          unit: 'kg',
          totalValue: 2500000,
          currency: 'USD',
          destination: 'Germany',
          status: 'ACTIVE',
          issueDate: '2024-01-01',
          expiryDate: '2024-12-31',
          issuedBy: 'NBE Officer Ahmed Hassan',
          notes: 'Standard export license for coffee beans'
        },
        {
          id: '2',
          licenseNumber: 'EL-2024-002',
          exporterName: 'Highland Coffee Ltd.',
          exporterId: 'EXP-002',
          productType: 'Robusta Coffee Beans',
          quantity: 30000,
          unit: 'kg',
          totalValue: 1200000,
          currency: 'USD',
          destination: 'Italy',
          status: 'PENDING_RENEWAL',
          issueDate: '2023-12-01',
          expiryDate: '2024-11-30',
          issuedBy: 'NBE Officer Fatima Ali',
          lastRenewalDate: '2023-12-01',
          notes: 'License due for renewal'
        },
        {
          id: '3',
          licenseNumber: 'EL-2024-003',
          exporterName: 'Addis Export LLC',
          exporterId: 'EXP-003',
          productType: 'Arabica Coffee Beans',
          quantity: 75000,
          unit: 'kg',
          totalValue: 3750000,
          currency: 'USD',
          destination: 'United States',
          status: 'EXPIRED',
          issueDate: '2023-06-01',
          expiryDate: '2023-11-30',
          issuedBy: 'NBE Officer Tesfaye Bekele',
          notes: 'License expired, requires renewal'
        },
        {
          id: '4',
          licenseNumber: 'EL-2024-004',
          exporterName: 'Yirgacheffe Coffee Export',
          exporterId: 'EXP-004',
          productType: 'Specialty Arabica',
          quantity: 15000,
          unit: 'kg',
          totalValue: 900000,
          currency: 'USD',
          destination: 'Japan',
          status: 'SUSPENDED',
          issueDate: '2024-01-15',
          expiryDate: '2024-12-31',
          issuedBy: 'NBE Officer Sara Mohammed',
          notes: 'Suspended due to compliance issues'
        }
      ];
      
      setLicenses(mockLicenses);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'EXPIRED': return 'error';
      case 'SUSPENDED': return 'warning';
      case 'PENDING_RENEWAL': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle color="success" />;
      case 'EXPIRED': return <Error color="error" />;
      case 'SUSPENDED': return <Warning color="warning" />;
      case 'PENDING_RENEWAL': return <Schedule color="info" />;
      default: return <Assignment />;
    }
  };

  const handleViewLicense = (license: License) => {
    setSelectedLicense(license);
    setOpenDialog(true);
  };

  const handleEditLicense = (license: License) => {
    navigate(`/licenses/${license.id}/edit`);
  };

  const handleRenewLicense = async (licenseId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLicenses(prev => prev.map(license => 
        license.id === licenseId 
          ? { 
              ...license, 
              status: 'ACTIVE' as License['status'],
              lastRenewalDate: new Date().toISOString().split('T')[0],
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          : license
      ));
      
      showNotification('success', 'License Renewed', 'License has been successfully renewed');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to renew license');
    }
  };

  const handleSuspendLicense = async (licenseId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLicenses(prev => prev.map(license => 
        license.id === licenseId 
          ? { ...license, status: 'SUSPENDED' as License['status'] }
          : license
      ));
      
      showNotification('success', 'License Suspended', 'License has been suspended');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to suspend license');
    }
  };

  const handleActivateLicense = async (licenseId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLicenses(prev => prev.map(license => 
        license.id === licenseId 
          ? { ...license, status: 'ACTIVE' as License['status'] }
          : license
      ));
      
      showNotification('success', 'License Activated', 'License has been activated');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to activate license');
    }
  };

  const handleDownloadLicense = (license: License) => {
    // Generate and download license document
    const licenseContent = generateLicenseDocument(license);
    downloadDocument(licenseContent, `license-${license.licenseNumber}.pdf`);
  };

  const generateLicenseDocument = (license: License) => {
    // Simulate license document generation
    return `Export License Document\n\nLicense Number: ${license.licenseNumber}\nExporter: ${license.exporterName}\nProduct: ${license.productType}\nQuantity: ${license.quantity} ${license.unit}\nValue: ${license.currency} ${license.totalValue.toLocaleString()}\nDestination: ${license.destination}\nStatus: ${license.status}\nIssue Date: ${license.issueDate}\nExpiry Date: ${license.expiryDate}`;
  };

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.exporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const licenseStats = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'ACTIVE').length,
    expired: licenses.filter(l => l.status === 'EXPIRED').length,
    suspended: licenses.filter(l => l.status === 'SUSPENDED').length,
    pendingRenewal: licenses.filter(l => l.status === 'PENDING_RENEWAL').length
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          License Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchLicenses}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/licenses/new')}
          >
            Issue New License
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">{licenseStats.total}</Typography>
                  <Typography color="text.secondary">Total Licenses</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">{licenseStats.active}</Typography>
                  <Typography color="text.secondary">Active</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Error />
                </Avatar>
                <Box>
                  <Typography variant="h6">{licenseStats.expired}</Typography>
                  <Typography color="text.secondary">Expired</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6">{licenseStats.suspended}</Typography>
                  <Typography color="text.secondary">Suspended</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6">{licenseStats.pendingRenewal}</Typography>
                  <Typography color="text.secondary">Pending Renewal</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  <MenuItem value="PENDING_RENEWAL">Pending Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Licenses Table */}
      <Card>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>License</TableCell>
                    <TableCell>Exporter</TableCell>
                    <TableCell>Product & Quantity</TableCell>
                    <TableCell>Value & Destination</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLicenses.map((license) => (
                    <TableRow key={license.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {license.licenseNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Issued: {new Date(license.issueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <Business />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {license.exporterName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {license.exporterId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{license.productType}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {license.quantity.toLocaleString()} {license.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: license.currency
                          }).format(license.totalValue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {license.destination}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(license.status)}
                          label={license.status.replace('_', ' ')}
                          color={getStatusColor(license.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(license.expiryDate).toLocaleDateString()}
                        </Typography>
                        {license.status === 'EXPIRED' && (
                          <Typography variant="caption" color="error">
                            Expired
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewLicense(license)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit License">
                            <IconButton size="small" onClick={() => handleEditLicense(license)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download License">
                            <IconButton size="small" onClick={() => handleDownloadLicense(license)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                          {license.status === 'EXPIRED' && (
                            <Tooltip title="Renew License">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleRenewLicense(license.id)}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                          )}
                          {license.status === 'ACTIVE' && (
                            <Tooltip title="Suspend License">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleSuspendLicense(license.id)}
                              >
                                <Gavel />
                              </IconButton>
                            </Tooltip>
                          )}
                          {license.status === 'SUSPENDED' && (
                            <Tooltip title="Activate License">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleActivateLicense(license.id)}
                              >
                                <CheckCircle />
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
          )}
        </CardContent>
      </Card>

      {/* License Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedLicense && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getStatusIcon(selectedLicense.status)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  License Details: {selectedLicense.licenseNumber}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>License Number</Typography>
                  <Typography variant="body2">{selectedLicense.licenseNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip
                    label={selectedLicense.status.replace('_', ' ')}
                    color={getStatusColor(selectedLicense.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Exporter</Typography>
                  <Typography variant="body2">{selectedLicense.exporterName}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedLicense.exporterId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Product Type</Typography>
                  <Typography variant="body2">{selectedLicense.productType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Quantity</Typography>
                  <Typography variant="body2">
                    {selectedLicense.quantity.toLocaleString()} {selectedLicense.unit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Total Value</Typography>
                  <Typography variant="body2">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: selectedLicense.currency
                    }).format(selectedLicense.totalValue)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Destination</Typography>
                  <Typography variant="body2">{selectedLicense.destination}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Issue Date</Typography>
                  <Typography variant="body2">{new Date(selectedLicense.issueDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Expiry Date</Typography>
                  <Typography variant="body2">{new Date(selectedLicense.expiryDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Issued By</Typography>
                  <Typography variant="body2">{selectedLicense.issuedBy}</Typography>
                </Grid>
                {selectedLicense.lastRenewalDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Last Renewal</Typography>
                    <Typography variant="body2">{new Date(selectedLicense.lastRenewalDate).toLocaleDateString()}</Typography>
                  </Grid>
                )}
                {selectedLicense.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                    <Typography variant="body2">{selectedLicense.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={() => {
                  handleDownloadLicense(selectedLicense);
                  setOpenDialog(false);
                }}
              >
                Download License
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LicenseManagement;
