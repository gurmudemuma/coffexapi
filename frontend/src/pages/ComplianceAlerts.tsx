import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Grid,
  Divider,
  Avatar,
  Tooltip,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Visibility,
  Block,
  PlayArrow,
  Refresh,
  FilterList,
  Search,
  Assignment,
  Schedule,
  Gavel,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface ComplianceAlert {
  id: string;
  type: 'license_expiry' | 'document_validation' | 'compliance_violation' | 'system_alert';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  exporterId: string;
  exporterName: string;
  documentId?: string;
  documentType?: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  dueDate?: Date;
  actions: string[];
}

const ComplianceAlerts: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAlerts: ComplianceAlert[] = [
      {
        id: '1',
        type: 'license_expiry',
        severity: 'critical',
        title: 'Export License Expiring Soon',
        description: 'Export license EL-2024-045 for Ethiopia Coffee Co. expires in 3 days',
        exporterId: 'EXP-001',
        exporterName: 'Ethiopia Coffee Co.',
        documentId: 'EL-2024-045',
        documentType: 'Export License',
        status: 'active',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        actions: ['Notify Exporter', 'Extend License', 'Generate Report']
      },
      {
        id: '2',
        type: 'document_validation',
        severity: 'high',
        title: 'Quality Certificate Validation Failed',
        description: 'Quality certificate QC-2024-078 has failed automated validation checks',
        exporterId: 'EXP-002',
        exporterName: 'Highland Coffee Ltd.',
        documentId: 'QC-2024-078',
        documentType: 'Quality Certificate',
        status: 'active',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        assignedTo: 'Quality Inspector',
        actions: ['Review Document', 'Request Resubmission', 'Override Validation']
      },
      {
        id: '3',
        type: 'compliance_violation',
        severity: 'medium',
        title: 'Shipping Document Inconsistency',
        description: 'Shipping weight discrepancy detected in shipment SH-2024-156',
        exporterId: 'EXP-003',
        exporterName: 'Addis Export LLC',
        documentId: 'SH-2024-156',
        documentType: 'Shipping Document',
        status: 'acknowledged',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        assignedTo: 'Customs Validator',
        actions: ['Investigate Discrepancy', 'Contact Exporter', 'Approve Override']
      },
      {
        id: '4',
        type: 'system_alert',
        severity: 'low',
        title: 'Blockchain Sync Delay',
        description: 'Blockchain synchronization delayed by 5 minutes',
        exporterId: 'SYSTEM',
        exporterName: 'System Alert',
        status: 'resolved',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
        actions: ['Monitor Sync', 'Check Network', 'Restart Services']
      }
    ];
    
    setAlerts(mockAlerts);
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'error';
      case 'acknowledged': return 'warning';
      case 'resolved': return 'success';
      case 'dismissed': return 'default';
      default: return 'default';
    }
  };

  const handleViewAlert = (alert: ComplianceAlert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleUpdateAlertStatus = async (alertId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: newStatus as any, updatedAt: new Date() }
          : alert
      ));
      
      const alert = alerts.find(a => a.id === alertId);
      showNotification('success', 'Alert Updated', `Alert "${alert?.title}" marked as ${newStatus}`);
      
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert({ ...selectedAlert, status: newStatus as any, updatedAt: new Date() });
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to update alert status');
    }
  };

  const handleTakeAction = async (action: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification('success', 'Action Taken', `${action} completed successfully`);
      setOpenDialog(false);
    } catch (error) {
      showNotification('error', 'Error', `Failed to execute ${action}`);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.exporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesTab = selectedTab === 0 || 
                      (selectedTab === 1 && alert.status === 'active') ||
                      (selectedTab === 2 && alert.status === 'acknowledged') ||
                      (selectedTab === 3 && (alert.status === 'resolved' || alert.status === 'dismissed'));
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesTab;
  });

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved' || a.status === 'dismissed').length
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Compliance Alerts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAlerts}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Assignment />}>
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">{alertCounts.total}</Typography>
                  <Typography color="text.secondary">Total Alerts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6">{alertCounts.active}</Typography>
                  <Typography color="text.secondary">Active Alerts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6">{alertCounts.acknowledged}</Typography>
                  <Typography color="text.secondary">Acknowledged</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">{alertCounts.resolved}</Typography>
                  <Typography color="text.secondary">Resolved</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="acknowledged">Acknowledged</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="dismissed">Dismissed</MenuItem>
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
                  setFilterSeverity('all');
                  setFilterStatus('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alerts Table with Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label={`All (${alertCounts.total})`} />
            <Tab label={`Active (${alertCounts.active})`} />
            <Tab label={`Acknowledged (${alertCounts.acknowledged})`} />
            <Tab label={`Resolved (${alertCounts.resolved})`} />
          </Tabs>
        </Box>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Alert</TableCell>
                    <TableCell>Exporter</TableCell>
                    <TableCell>Document</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getSeverityIcon(alert.severity)}
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {alert.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {alert.description.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {alert.exporterName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.exporterId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {alert.documentId ? (
                          <Box>
                            <Typography variant="body2">{alert.documentType}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.documentId}
                            </Typography>
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getSeverityIcon(alert.severity)}
                          label={alert.severity.toUpperCase()}
                          color={getSeverityColor(alert.severity) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.status.toUpperCase()}
                          color={getStatusColor(alert.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewAlert(alert)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {alert.status === 'active' && (
                            <Tooltip title="Acknowledge">
                              <IconButton 
                                size="small" 
                                onClick={() => handleUpdateAlertStatus(alert.id, 'acknowledged')}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                          )}
                          {user?.permissions.includes('regulatory:all') && (
                            <Tooltip title="Take Action">
                              <IconButton size="small">
                                <Gavel />
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

      {/* Alert Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedAlert && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getSeverityIcon(selectedAlert.severity)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedAlert.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity={getSeverityColor(selectedAlert.severity) as any}>
                    {selectedAlert.description}
                  </Alert>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Exporter</Typography>
                  <Typography variant="body2">{selectedAlert.exporterName}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedAlert.exporterId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip
                    label={selectedAlert.status.toUpperCase()}
                    color={getStatusColor(selectedAlert.status) as any}
                    size="small"
                  />
                </Grid>
                {selectedAlert.documentId && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Document</Typography>
                    <Typography variant="body2">{selectedAlert.documentType}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedAlert.documentId}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Created</Typography>
                  <Typography variant="body2">
                    {formatDistanceToNow(selectedAlert.createdAt, { addSuffix: true })}
                  </Typography>
                </Grid>
                {selectedAlert.assignedTo && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Assigned To</Typography>
                    <Typography variant="body2">{selectedAlert.assignedTo}</Typography>
                  </Grid>
                )}
                {selectedAlert.dueDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Due Date</Typography>
                    <Typography variant="body2">
                      {formatDistanceToNow(selectedAlert.dueDate, { addSuffix: true })}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Available Actions</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedAlert.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleTakeAction(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {selectedAlert.status === 'active' && (
                <Button 
                  onClick={() => {
                    handleUpdateAlertStatus(selectedAlert.id, 'acknowledged');
                    setOpenDialog(false);
                  }}
                  variant="contained"
                >
                  Acknowledge
                </Button>
              )}
              {selectedAlert.status === 'acknowledged' && (
                <Button 
                  onClick={() => {
                    handleUpdateAlertStatus(selectedAlert.id, 'resolved');
                    setOpenDialog(false);
                  }}
                  variant="contained"
                  color="success"
                >
                  Mark Resolved
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ComplianceAlerts;