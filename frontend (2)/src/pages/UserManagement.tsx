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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle,
  Person,
  AdminPanelSettings,
  Shield,
  Business,
  Download,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { useNotifications } from '../contexts/NotificationContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  lastActive?: string; // Added for new functionality
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  organization: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
}

const availablePermissions = [
  'license:create', 'license:read', 'license:update', 'license:delete',
  'declaration:read', 'declaration:approve', 'declaration:reject',
  'compliance:screen', 'compliance:override', 'compliance:freeze',
  'shipping:validate', 'document:review', 'customs:approve',
  'quality:inspect', 'certificate:issue', 'quality:approve',
  'invoice:validate', 'payment:process', 'bank:approve',
  'regulatory:all', 'audit:read', 'user:manage'
];

const organizationTypes = [
  'The Mint',
  'Customs Authority', 
  'Coffee Quality Authority',
  'Exporter Bank',
  'Commercial Bank of Ethiopia'
];

const roleTypes = [
  'NBE_ADMIN', 'NBE_OFFICER',
  'CUSTOMS_VALIDATOR', 'QUALITY_INSPECTOR',
  'BANK_VALIDATOR', 'SYSTEM_ADMIN'
];

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: '',
    organization: '',
    permissions: [],
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@nbe.gov.et',
        role: 'NBE_ADMIN',
        organization: 'The Mint',
        permissions: ['license:create', 'license:read', 'license:update', 'regulatory:all', 'user:manage'],
        status: 'active',
        lastLogin: '2024-01-15 09:30',
        createdAt: '2023-12-01',
        lastActive: '2024-01-15 09:30' // Added for new functionality
      },
      {
        id: '2',
        name: 'Fatima Ali',
        email: 'fatima.ali@customs.gov.et',
        role: 'CUSTOMS_VALIDATOR',
        organization: 'Customs Authority',
        permissions: ['shipping:validate', 'document:review', 'customs:approve'],
        status: 'active',
        lastLogin: '2024-01-15 08:45',
        createdAt: '2023-11-15',
        lastActive: '2024-01-15 08:45' // Added for new functionality
      },
      {
        id: '3',
        name: 'Tesfaye Bekele',
        email: 'tesfaye.bekele@quality.gov.et',
        role: 'QUALITY_INSPECTOR',
        organization: 'Coffee Quality Authority',
        permissions: ['quality:inspect', 'certificate:issue', 'quality:approve'],
        status: 'active',
        lastLogin: '2024-01-14 16:20',
        createdAt: '2023-10-20',
        lastActive: '2024-01-14 16:20' // Added for new functionality
      },
      {
        id: '4',
        name: 'Sara Mohammed',
        email: 'sara.mohammed@cbe.com.et',
        role: 'BANK_VALIDATOR',
        organization: 'Commercial Bank of Ethiopia',
        permissions: ['invoice:validate', 'payment:process', 'bank:approve'],
        status: 'suspended',
        lastLogin: '2024-01-10 14:15',
        createdAt: '2023-09-10',
        lastActive: '2024-01-10 14:15' // Added for new functionality
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        permissions: user.permissions,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        organization: '',
        permissions: [],
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...formData }
            : u
        ));
        showNotification('success', 'User Updated', `${formData.name} has been updated successfully`);
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          lastLogin: 'Never',
          createdAt: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString().split('T')[0] // Added for new functionality
        };
        setUsers(prev => [...prev, newUser]);
        showNotification('success', 'User Created', `${formData.name} has been added successfully`);
      }
      
      handleCloseDialog();
    } catch (error) {
      showNotification('error', 'Error', 'Failed to save user');
    }
  };

  // Enhanced button handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      organization: '',
      permissions: [],
      status: 'active'
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      permissions: [...user.permissions],
      status: user.status
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // In a real app, you'd make an API call here
        setUsers(prev => prev.filter(u => u.id !== userId));
        console.log(`User ${userId} deleted successfully`);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: 'suspended' as User['status'] }
          : u
      ));
      console.log(`User ${userId} suspended successfully`);
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: 'active' as User['status'] }
          : u
      ));
      console.log(`User ${userId} activated successfully`);
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleViewUserDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleExportUsers = () => {
    // Export users data as CSV
    const csvContent = generateUsersCSV(users);
    downloadCSV(csvContent, 'users-data.csv');
  };

  // CSV generation and download functions
  const generateUsersCSV = (data: User[]) => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Organization', 'Status', 'Permissions'];
    const rows = data.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.organization,
      user.status,
      user.permissions.join('; ')
    ]);
    
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('ADMIN')) return <AdminPanelSettings />;
    if (role.includes('VALIDATOR') || role.includes('INSPECTOR')) return <Shield />;
    return <Person />;
  };

  const getOrganizationIcon = (org: string) => {
    return <Business />;
  };

  // Check if current user has permission to manage users
  const canManageUsers = currentUser?.permissions.includes('user:manage');

  if (!canManageUsers) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to manage users.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header with Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportUsers}
          >
            Export Users
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateUser}
          >
            Create User
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
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6">{users.length}</Typography>
                  <Typography color="text.secondary">Total Users</Typography>
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
                  <Typography variant="h6">{users.filter(u => u.status === 'active').length}</Typography>
                  <Typography color="text.secondary">Active Users</Typography>
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
                  <Block />
                </Avatar>
                <Box>
                  <Typography variant="h6">{users.filter(u => u.status === 'suspended').length}</Typography>
                  <Typography color="text.secondary">Suspended</Typography>
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
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h6">{users.filter(u => u.role.includes('ADMIN')).length}</Typography>
                  <Typography color="text.secondary">Administrators</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role & Organization</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRoleIcon(user.role)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.role}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.organization}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {user.permissions.slice(0, 3).map((permission) => (
                          <Chip key={permission} label={permission} size="small" variant="outlined" />
                        ))}
                        {user.permissions.length > 3 && (
                          <Chip label={`+${user.permissions.length - 3} more`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastLogin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewUserDetails(user.id)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleEditUser(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {user.status === 'active' ? (
                          <Tooltip title="Suspend User">
                            <IconButton 
                              size="small" 
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              <Block />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activate User">
                            <IconButton 
                              size="small" 
                              onClick={() => handleActivateUser(user.id)}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {roleTypes.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                >
                  {organizationTypes.map((org) => (
                    <MenuItem key={org} value={org}>{org}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
              <FormGroup>
                <Grid container spacing={1}>
                  {availablePermissions.map((permission) => (
                    <Grid item xs={12} sm={6} md={4} key={permission}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  permissions: [...formData.permissions, permission]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  permissions: formData.permissions.filter(p => p !== permission)
                                });
                              }
                            }}
                          />
                        }
                        label={permission}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveUser}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.role || !formData.organization}
          >
            {editingUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;