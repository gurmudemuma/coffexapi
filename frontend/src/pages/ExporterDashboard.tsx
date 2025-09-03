import React, { useState, useEffect } from 'react';
import { 
  Error as ErrorIcon
} from '@mui/icons-material';

import { 
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '../components/ui';

import { useAuth } from '../store';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';
import { SimplifiedExporterDashboard } from '../components/export/SimplifiedExporterDashboard';

const ExporterDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [accessError, setAccessError] = useState<string | null>(null);

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  // Organization-specific access validation
  useEffect(() => {
    if (!user) {
      setAccessError('User authentication required');
      return;
    }

    // Validate user's organization is Coffee Exporters Association
    if (user.organization !== 'Coffee Exporters Association') {
      setAccessError(`Access denied: This dashboard is only accessible to Coffee Exporters Association members. Your organization: ${user.organization}`);
      return;
    }

    // Validate user's role is EXPORTER
    if (user.role !== 'EXPORTER') {
      setAccessError(`Access denied: Only users with EXPORTER role can access this dashboard. Your role: ${user.role}`);
      return;
    }

    setAccessError(null);
  }, [user]);

  // Display access error if user doesn't have proper organization access
  if (accessError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-red-500">
          <CardContent className="p-6">
            <Alert variant="error">
              <div className="flex items-center gap-3">
                <ErrorIcon className="h-6 w-6 text-red-500" />
                <div>
                  <AlertTitle>Organization Access Denied</AlertTitle>
                  <p className="mt-1">{accessError}</p>
                  <p className="text-sm mt-2">Please contact your system administrator if you believe this is an error.</p>
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For exporters, show a simplified dashboard focused only on core export tasks
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SimplifiedExporterDashboard
        orgBranding={orgBranding}
      />
    </div>
  );
};

export default ExporterDashboard;