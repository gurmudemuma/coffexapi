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
  Grid,
  Avatar,
  Tooltip,
  Pagination,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  History,
  Visibility,
  Download,
  Search,
  FilterList,
  ExpandMore,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Assignment,
  Business,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { formatDistanceToNow, format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  organization: string;
  action: string;
  category: 'document_validation' | 'user_management' | 'system_operation' | 'compliance_action';
  resourceType: string;
  resourceId: string;
  details: {
    before?: any;
    after?: any;
    metadata?: any;
  };
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  description: string;
}

const AuditTrail: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  useEffect(() => {
    fetchAuditLogs();
  }, [page, dateRange, filterCategory, filterStatus, filterUser]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAuditLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        userId: 'user-001',
        userName: 'Ahmed Hassan',
        userRole: 'NBE_ADMIN',
        organization: 'National Bank of Ethiopia',
        action: 'DOCUMENT_APPROVED',
        category: 'document_validation',
        resourceType: 'Export License',
        resourceId: 'EL-2024-089',
        details: {
          before: { status: 'pending' },
          after: { status: 'approved' },
          metadata: { approvalNotes: 'All requirements met' }
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'success',
        description: 'Export license EL-2024-089 approved for Ethiopia Coffee Co.'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        userId: 'user-002',
        userName: 'Fatima Ali',
        userRole: 'CUSTOMS_VALIDATOR',
        organization: 'Customs Authority',
        action: 'DOCUMENT_REJECTED',
        category: 'document_validation',
        resourceType: 'Shipping Document',
        resourceId: 'SH-2024-234',
        details: {
          before: { status: 'pending' },
          after: { status: 'rejected' },
          metadata: { rejectionReason: 'Incomplete shipping manifest' }
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'success',
        description: 'Shipping document SH-2024-234 rejected due to incomplete information'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        userId: 'user-003',
        userName: 'Tesfaye Bekele',
        userRole: 'QUALITY_INSPECTOR',
        organization: 'Coffee Quality Authority',
        action: 'CERTIFICATE_ISSUED',
        category: 'document_validation',
        resourceType: 'Quality Certificate',
        resourceId: 'QC-2024-156',
        details: {
          before: { status: 'inspection_complete' },
          after: { status: 'certificate_issued' },
          metadata: { 
            qualityGrade: 'Grade 1',
            moistureContent: '11.5%',
            defectRate: '2.1%'
          }
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'success',
        description: 'Quality certificate QC-2024-156 issued for Highland Coffee Ltd.'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        userId: 'user-001',
        userName: 'Ahmed Hassan',
        userRole: 'NBE_ADMIN',
        organization: 'National Bank of Ethiopia',
        action: 'USER_CREATED',
        category: 'user_management',
        resourceType: 'User Account',
        resourceId: 'user-005',
        details: {
          after: {
            name: 'Sara Mohammed',
            role: 'BANK_VALIDATOR',
            organization: 'Commercial Bank of Ethiopia',
            permissions: ['invoice:validate', 'payment:process']
          },
          metadata: { createdBy: 'Ahmed Hassan' }
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'success',
        description: 'New user account created for Sara Mohammed'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        userId: 'system',
        userName: 'System',
        userRole: 'SYSTEM',
        organization: 'System',
        action: 'BLOCKCHAIN_SYNC',
        category: 'system_operation',
        resourceType: 'Blockchain',
        resourceId: 'block-789456',
        details: {
          metadata: {
            blockHeight: 789456,
            transactionCount: 23,
            syncDuration: '2.3s'
          }
        },
        ipAddress: '127.0.0.1',
        userAgent: 'System Process',
        status: 'success',
        description: 'Blockchain synchronized successfully with 23 transactions'
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        userId: 'user-002',
        userName: 'Fatima Ali',
        userRole: 'CUSTOMS_VALIDATOR',
        organization: 'Customs Authority',
        action: 'LOGIN_FAILED',
        category: 'system_operation',
        resourceType: 'Authentication',
        resourceId: 'auth-session',
        details: {
          metadata: {
            reason: 'Invalid password',
            attemptCount: 3
          }
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'failure',
        description: 'Failed login attempt for user fatima.ali@customs.gov.et'
      }
    ];
    
    setAuditLogs(mockAuditLogs);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failure': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'failure': return <Cancel />;
      case 'warning': return <Schedule />;
      default: return <Assignment />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document_validation': return 'primary';
      case 'user_management': return 'secondary';
      case 'system_operation': return 'info';
      case 'compliance_action': return 'warning';
      default: return 'default';
    }
  };

  const handleViewDetails = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setOpenDialog(true);
  };

  const handleExportAuditLog = () => {
    // Simulate export functionality
    const csvData = auditLogs.map(entry => ({
      timestamp: format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      user: entry.userName,
      action: entry.action,
      resource: `${entry.resourceType}:${entry.resourceId}`,
      status: entry.status,
      description: entry.description
    }));
    
    // In a real application, this would generate and download a CSV file
    console.log('Exporting audit log:', csvData);
    alert('Audit log export would be downloaded here');
  };

  const filteredLogs = auditLogs.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.resourceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesUser = filterUser === 'all' || entry.userId === filterUser;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesUser;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.userId)))
    .map(userId => auditLogs.find(log => log.userId === userId))
    .filter(Boolean);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Audit Trail
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAuditLogs}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleExportAuditLog}>
            Export Log
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
                  <History />
                </Avatar>
                <Box>
                  <Typography variant="h6">{auditLogs.length}</Typography>
                  <Typography color="text.secondary">Total Events</Typography>
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
                  <Typography variant="h6">
                    {auditLogs.filter(log => log.status === 'success').length}
                  </Typography>
                  <Typography color="text.secondary">Successful</Typography>
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
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {auditLogs.filter(log => log.status === 'failure').length}
                  </Typography>
                  <Typography color="text.secondary">Failed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">{uniqueUsers.length}</Typography>
                  <Typography color="text.secondary">Active Users</Typography>
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="document_validation">Document Validation</MenuItem>
                  <MenuItem value="user_management">User Management</MenuItem>
                  <MenuItem value="system_operation">System Operation</MenuItem>
                  <MenuItem value="compliance_action">Compliance Action</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failure">Failure</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  {uniqueUsers.map((user) => (
                    <MenuItem key={user!.userId} value={user!.userId}>
                      {user!.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="1d">Last 24 Hours</MenuItem>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="90d">Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                  setFilterUser('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent>
          {loading ? (
            <LinearProgress />
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedLogs.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {format(entry.timestamp, 'MMM dd, yyyy HH:mm')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                              {entry.userName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {entry.userName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {entry.userRole}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entry.description.substring(0, 40)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{entry.resourceType}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {entry.resourceId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.category.replace('_', ' ').toUpperCase()}
                            color={getCategoryColor(entry.category) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(entry.status)}
                            label={entry.status.toUpperCase()}
                            color={getStatusColor(entry.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewDetails(entry)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Audit Entry Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedEntry && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getStatusIcon(selectedEntry.status)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Audit Log Details
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Timestamp</Typography>
                  <Typography variant="body2">
                    {format(selectedEntry.timestamp, 'PPpp')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>User</Typography>
                  <Typography variant="body2">
                    {selectedEntry.userName} ({selectedEntry.userRole})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedEntry.organization}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Action</Typography>
                  <Typography variant="body2">{selectedEntry.action}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Resource</Typography>
                  <Typography variant="body2">
                    {selectedEntry.resourceType}: {selectedEntry.resourceId}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Description</Typography>
                  <Typography variant="body2">{selectedEntry.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>IP Address</Typography>
                  <Typography variant="body2">{selectedEntry.ipAddress}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedEntry.status)}
                    label={selectedEntry.status.toUpperCase()}
                    color={getStatusColor(selectedEntry.status) as any}
                    size="small"
                  />
                </Grid>
                
                {/* Details Accordion */}
                {(selectedEntry.details.before || selectedEntry.details.after || selectedEntry.details.metadata) && (
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">Technical Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {selectedEntry.details.before && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>Before:</Typography>
                            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                              {JSON.stringify(selectedEntry.details.before, null, 2)}
                            </pre>
                          </Box>
                        )}
                        {selectedEntry.details.after && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>After:</Typography>
                            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                              {JSON.stringify(selectedEntry.details.after, null, 2)}
                            </pre>
                          </Box>
                        )}
                        {selectedEntry.details.metadata && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>Metadata:</Typography>
                            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                              {JSON.stringify(selectedEntry.details.metadata, null, 2)}
                            </pre>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Export Entry
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AuditTrail;