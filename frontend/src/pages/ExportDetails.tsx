import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Download,
  CheckCircle,
  Pending,
  Error,
  Assignment,
  Business,
  LocalShipping,
  Payment,
  Description,
  Timeline,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../store';
import { useNotifications } from '../contexts/NotificationContext';

interface ExportDetails {
  id: string;
  exportId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'PAYMENT_RELEASED';
  exporter: {
    name: string;
    id: string;
    email: string;
    phone: string;
  };
  tradeDetails: {
    productType: string;
    quantity: number;
    unit: string;
    totalValue: number;
    currency: string;
    destination: string;
    expectedShipmentDate: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploadedAt: string;
    url?: string;
  }[];
  validationSummary: {
    totalValidations: number;
    completedValidations: number;
    pendingValidations: number;
    failedValidations: number;
  };
  timeline: {
    date: string;
    action: string;
    actor: string;
    status: string;
    notes?: string;
  }[];
  submittedAt: string;
  lastUpdated: string;
}

const ExportDetails: React.FC = () => {
  const { exportId } = useParams<{ exportId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [exportDetails, setExportDetails] = useState<ExportDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (exportId) {
      fetchExportDetails();
    }
  }, [exportId]);

  const fetchExportDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockExportDetails: ExportDetails = {
        id: exportId!,
        exportId: `EXP-${exportId}`,
        status: 'VALIDATING',
        exporter: {
          name: 'Ethiopia Coffee Co.',
          id: 'EXP-001',
          email: 'info@ethiopiacoffee.com',
          phone: '+251-911-123-456'
        },
        tradeDetails: {
          productType: 'Arabica Coffee Beans',
          quantity: 50000,
          unit: 'kg',
          totalValue: 2500000,
          currency: 'USD',
          destination: 'Germany',
          expectedShipmentDate: '2024-02-15'
        },
        documents: [
          {
            id: 'doc-1',
            name: 'Export License',
            type: 'LICENSE',
            status: 'APPROVED',
            uploadedAt: '2024-01-10T10:30:00Z',
            url: '#'
          },
          {
            id: 'doc-2',
            name: 'Quality Certificate',
            type: 'CERTIFICATE',
            status: 'PENDING',
            uploadedAt: '2024-01-10T11:15:00Z',
            url: '#'
          },
          {
            id: 'doc-3',
            name: 'Commercial Invoice',
            type: 'INVOICE',
            status: 'APPROVED',
            uploadedAt: '2024-01-10T12:00:00Z',
            url: '#'
          }
        ],
        validationSummary: {
          totalValidations: 4,
          completedValidations: 2,
          pendingValidations: 1,
          failedValidations: 0
        },
        timeline: [
          {
            date: '2024-01-10T12:00:00Z',
            action: 'Export Request Submitted',
            actor: 'Ethiopia Coffee Co.',
            status: 'SUBMITTED'
          },
          {
            date: '2024-01-10T13:30:00Z',
            action: 'Export License Validated',
            actor: 'NBE Officer',
            status: 'APPROVED',
            notes: 'License verified and approved'
          },
          {
            date: '2024-01-10T14:15:00Z',
            action: 'Commercial Invoice Validated',
            actor: 'Customs Officer',
            status: 'APPROVED',
            notes: 'Invoice details verified'
          },
          {
            date: '2024-01-10T15:00:00Z',
            action: 'Quality Certificate Pending',
            actor: 'Quality Inspector',
            status: 'PENDING',
            notes: 'Awaiting sample inspection'
          }
        ],
        submittedAt: '2024-01-10T12:00:00Z',
        lastUpdated: '2024-01-10T15:00:00Z'
      };
      
      setExportDetails(mockExportDetails);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load export details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'secondary';
      case 'VALIDATING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PAYMENT_RELEASED': return 'success';
      default: return 'default';
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle color="success" />;
      case 'PENDING': return <Pending color="warning" />;
      case 'REJECTED': return <Error color="error" />;
      default: return <Pending />;
    }
  };

  const handleEditExport = () => {
    navigate(`/exports/${exportId}/edit`);
  };

  const handleDownloadDocument = (documentId: string, documentName: string) => {
    // Simulate document download
    showNotification('success', 'Download Started', `${documentName} download initiated`);
  };

  const handleRefresh = () => {
    fetchExportDetails();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading export details...</Typography>
      </Box>
    );
  }

  if (!exportDetails) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Export not found</Alert>
      </Box>
    );
  }

  const validationProgress = (exportDetails.validationSummary.completedValidations / exportDetails.validationSummary.totalValidations) * 100;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" gutterBottom>
              Export Details: {exportDetails.exportId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date(exportDetails.lastUpdated).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          {exportDetails.status === 'DRAFT' && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditExport}
            >
              Edit Export
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Export Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={exportDetails.status.replace('_', ' ')}
                    color={getStatusColor(exportDetails.status) as any}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Product Type</Typography>
                  <Typography variant="body1">{exportDetails.tradeDetails.productType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                  <Typography variant="body1">
                    {exportDetails.tradeDetails.quantity.toLocaleString()} {exportDetails.tradeDetails.unit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Total Value</Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: exportDetails.tradeDetails.currency
                    }).format(exportDetails.tradeDetails.totalValue)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Destination</Typography>
                  <Typography variant="body1">{exportDetails.tradeDetails.destination}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Expected Shipment</Typography>
                  <Typography variant="body1">
                    {new Date(exportDetails.tradeDetails.expectedShipmentDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Validation Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Validation Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {exportDetails.validationSummary.completedValidations} of {exportDetails.validationSummary.totalValidations} validations completed
                  </Typography>
                  <Typography variant="body2">{Math.round(validationProgress)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={validationProgress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {exportDetails.validationSummary.completedValidations}
                    </Typography>
                    <Typography variant="caption">Completed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main">
                      {exportDetails.validationSummary.pendingValidations}
                    </Typography>
                    <Typography variant="caption">Pending</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">
                      {exportDetails.validationSummary.failedValidations}
                    </Typography>
                    <Typography variant="caption">Failed</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <List>
                {exportDetails.documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemIcon>
                      {getDocumentStatusIcon(doc.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={`${doc.type} • Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                    />
                    <Box>
                      <Chip
                        label={doc.status}
                        color={getStatusColor(doc.status) as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Download Document">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadDocument(doc.id, doc.name)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Exporter Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exporter Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{exportDetails.exporter.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{exportDetails.exporter.id}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {exportDetails.exporter.email}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {exportDetails.exporter.phone}
              </Typography>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Stepper orientation="vertical">
                {exportDetails.timeline.map((event, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Typography variant="subtitle2">{event.action}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.date).toLocaleString()}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {event.actor}
                      </Typography>
                      {event.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {event.notes}
                        </Typography>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExportDetails;
