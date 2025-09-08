import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '../components/ui/StandardComponents';
import { FileText, List, Plus } from 'lucide-react';
import { useAuth } from '../store';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

const ExportIndex: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  const handleCreateExport = () => {
    navigate('/export/new');
  };

  const handleViewExports = () => {
    navigate('/export/manage');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Export Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your coffee export requests and track their progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-dashed border-gray-300 hover:border-[#7B2CBF] transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div 
                className="p-3 rounded-lg mr-4"
                style={{ backgroundColor: `${orgBranding.primaryColor}10` }}
              >
                <Plus className="h-6 w-6" style={{ color: orgBranding.primaryColor }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Export Request
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start a new coffee export request by providing exporter details, trade information, and required documents.
            </p>
            <Button
              onClick={handleCreateExport}
              className="w-full"
              style={{ 
                backgroundColor: orgBranding.primaryColor
              }}
            >
              Create Export Request
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-300 hover:border-[#7B2CBF] transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div 
                className="p-3 rounded-lg mr-4"
                style={{ backgroundColor: `${orgBranding.secondaryColor}10` }}
              >
                <List className="h-6 w-6" style={{ color: orgBranding.secondaryColor }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                View All Exports
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View and manage all your existing export requests, track their status, and access documentation.
            </p>
            <Button
              onClick={handleViewExports}
              variant="outline"
              className="w-full"
              style={{ 
                borderColor: orgBranding.secondaryColor,
                color: orgBranding.secondaryColor
              }}
            >
              View Exports
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Export Process Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Create Request</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Document Validation</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Approval Process</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-bold">4</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Payment Release</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportIndex;