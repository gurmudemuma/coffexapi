import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Add as AddIcon, 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { 
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge
} from '../components/ui';

import { useAuth } from '../store';
import { useExports } from '../store';
import ExportForm from '../components/ExportForm';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

type ExportStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'VALIDATING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAYMENT_RELEASED';

type ExportSummary = {
  id: string;
  exportId: string;
  productType: string;
  quantity: number;
  totalValue: number;
  currency: string;
  destination: string;
  status: ExportStatus;
  submittedAt?: number;
  validationProgress: number;
  urgentActions: string[];
};

const ExportManage: React.FC = () => {
  const { user } = useAuth();
  const { exports: exportsData, loading } = useExports();
  const navigate = useNavigate();
  
  const [exportSummaries, setExportSummaries] = useState<ExportSummary[]>([]);
  const [activeTab, setActiveTab] = useState('new-export');

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  React.useEffect(() => {
    if (user) {
      // Transform exports to summaries - only show exports belonging to current user
      const userExports = Object.values(exportsData || {}).filter((exportRequest: any) => {
        // Filter exports to only show those belonging to the current user
        return exportRequest?.exporterId === user?.id;
      });
      
      const summaries = userExports.map((exportRequest: any) => ({
        id: exportRequest.id,
        exportId: exportRequest.id,
        productType: exportRequest.tradeDetails?.productType || 'N/A',
        quantity: exportRequest.tradeDetails?.quantity || 0,
        totalValue: exportRequest.tradeDetails?.totalValue || 0,
        currency: exportRequest.tradeDetails?.currency || 'USD',
        destination: exportRequest.tradeDetails?.destination || 'N/A',
        status: exportRequest.status || 'DRAFT',
        submittedAt: exportRequest.submittedAt,
        validationProgress: exportRequest.validationSummary?.totalValidations > 0 
          ? (exportRequest.validationSummary.completedValidations / exportRequest.validationSummary.totalValidations) * 100 
          : 0,
        urgentActions: [],
      }));
      
      setExportSummaries(summaries);
    }
  }, [exportsData, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'secondary';
      case 'VALIDATING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      case 'PAYMENT_RELEASED': return 'success';
      default: return 'default';
    }
  };

  const handleViewExport = (exportId: string) => {
    navigate(`/exports/${exportId}`);
  };

  const handleEditExport = (exportId: string) => {
    navigate(`/exports/${exportId}/edit`);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading export requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Export Activities - Only the buttons and tabs section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-export" className="flex items-center gap-2">
            <AddIcon className="h-4 w-4" />
            Create Export Request
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <AssignmentIcon className="h-4 w-4" />
            My Export Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-export" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-green-600 mb-3">📋 Create Coffee Export Request</h3>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-800 font-medium">Complete Process:</p>
                  <div className="mt-2 text-sm text-green-700">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Fill company & trade details<br/>
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Upload required documents<br/>
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Submit for validation & approval
                  </div>
                </div>
              </div>
              
              <ExportForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-3">📊 My Export Requests</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-800 font-medium">Track & manage all your export requests in one place</p>
                </div>
              </div>

              {exportSummaries.length > 0 ? (
                <div className="space-y-4">
                  {exportSummaries.map((exportSummary) => (
                    <Card key={exportSummary.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg">{exportSummary.productType}</h4>
                          <Badge 
                            variant={getStatusColor(exportSummary.status)}
                            className="capitalize"
                          >
                            {exportSummary.status.toLowerCase().replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600 font-medium">Quantity</p>
                            <p className="font-semibold">{exportSummary.quantity.toLocaleString()} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Destination</p>
                            <p className="font-semibold">{exportSummary.destination}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Value</p>
                            <p className="font-semibold">{formatCurrency(exportSummary.totalValue, exportSummary.currency)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Submitted</p>
                            <p className="font-semibold">{formatDate(exportSummary.submittedAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewExport(exportSummary.exportId)}
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          >
                            <ViewIcon className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {exportSummary.status === 'DRAFT' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditExport(exportSummary.exportId)}
                              className="border-green-500 text-green-500 hover:bg-green-50"
                            >
                              <EditIcon className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <AssignmentIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-700">No Export Requests Yet</h4>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start your coffee export journey! Create your first export request and track its progress through our blockchain-validated system.
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => setActiveTab('new-export')} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <AddIcon className="w-5 h-5 mr-2" />
                    Create Your First Export Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportManage;