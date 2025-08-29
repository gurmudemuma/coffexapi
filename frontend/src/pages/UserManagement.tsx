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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Avatar,
  Tooltip,
  Alert,
  Grid,
  Divider,
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
  'National Bank of Ethiopia',
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
        organization: 'National Bank of Ethiopia',
        permissions: ['license:create', 'license:read', 'license:update', 'regulatory:all', 'user:manage'],
        status: 'active',
        lastLogin: '2024-01-15 09:30',
        createdAt: '2023-12-01'
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
        createdAt: '2023-11-15'
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
        createdAt: '2023-10-20'
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
        createdAt: '2023-09-10'
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
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => [...prev, newUser]);
        showNotification('success', 'User Created', `${formData.name} has been added successfully`);
      }
      
      handleCloseDialog();
    } catch (error) {
      showNotification('error', 'Error', 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = users.find(u => u.id === userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
        showNotification('success', 'User Deleted', `${user?.name} has been removed`);
      } catch (error) {
        showNotification('error', 'Error', 'Failed to delete user');
      }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus }
          : u
      ));
      
      const user = users.find(u => u.id === userId);
      showNotification('success', 'Status Updated', `${user?.name} is now ${newStatus}`);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to update user status');
    }
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New User
        </Button>
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
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {user.status === 'active' ? (
                          <Tooltip title="Suspend User">
                            <IconButton 
                              size="small" 
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                            >
                              <Block />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activate User">
                            <IconButton 
                              size="small" 
                              onClick={() => handleStatusChange(user.id, 'active')}
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