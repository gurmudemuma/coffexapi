import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Activity, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import ExportForm from './ExportForm';
import { ExporterDashboard } from './ExporterDashboard';

interface ExporterPortalProps {
  exporterName?: string;
}

export const ExporterPortal: React.FC<ExporterPortalProps> = ({ 
  exporterName = "Coffee Exporter Co." 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submit' | 'requests'>('overview');

  // Handle successful export submission
  const handleExportSuccess = () => {
    setActiveTab('requests');
  };

  // Listen for export success events
  useEffect(() => {
    const handleExportSubmissionSuccess = (event: CustomEvent) => {
      console.log('Export submission successful:', event.detail);
      toast.success('Export submitted successfully! Redirecting to tracking dashboard...');
      // Switch to tracking tab after successful submission
      setTimeout(() => {
        setActiveTab('requests');
      }, 1500);
    };

    const handlePortalNavigateToTracking = () => {
      console.log('Portal navigation to tracking requested');
      toast.info('Switching to tracking dashboard...');
      setActiveTab('requests');
    };

    // Listen for custom export success events
    window.addEventListener('exportSubmissionSuccess', handleExportSubmissionSuccess as EventListener);
    window.addEventListener('portalNavigateToTracking', handlePortalNavigateToTracking);
    
    return () => {
      window.removeEventListener('exportSubmissionSuccess', handleExportSubmissionSuccess as EventListener);
      window.removeEventListener('portalNavigateToTracking', handlePortalNavigateToTracking);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-dark-900 dark:to-dark-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-gold-100 dark:bg-gold-900/20 rounded-full mb-4">
            <span className="text-sm font-semibold text-gold-800 dark:text-gold-400">
              BLOCKCHAIN SECURED
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gold-600 mb-4">
            Exporter Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Submit new exports and track your document validation progress
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-border">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <div className="px-6 pt-6 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="submit" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Submit Export
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Track Requests
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab('submit')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Create Export Request</CardTitle>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B2CBF20' }}>
                      <Plus className="w-6 h-6" style={{ color: '#7B2CBF' }} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Begin a new export process by providing shipment details and uploading required documents.
                    </p>
                    <ul className="space-y-2 text-gray-600 text-sm mb-4">
                      <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Complete export application form</li>
                      <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Upload quality certificates</li>
                      <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Submit shipping documents</li>
                    </ul>
                    <Button className="w-full" style={{ backgroundColor: '#7B2CBF' }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Export
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveTab('requests')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Manage Existing Exports</CardTitle>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EFB80B20' }}>
                      <Activity className="w-6 h-6" style={{ color: '#EFB80B' }} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Track validation progress, view approval history, and download certified documents.
                    </p>
                    <Button variant="outline" className="w-full" style={{ borderColor: '#7B2CBF', color: '#7B2CBF' }}>
                      <Activity className="w-4 h-4 mr-2" />
                      View Exports
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#7B2CBF' }} />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Enhanced Security</h4>
                        <p className="text-gray-600 text-sm">Blockchain-secured documentation prevents fraud</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#EFB80B' }} />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Real-time Tracking</h4>
                        <p className="text-gray-600 text-sm">Monitor export progress at every stage</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#10B981' }} />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Regulatory Compliance</h4>
                        <p className="text-gray-600 text-sm">Ensure adherence to international trade standards</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submit Export Tab */}
            <TabsContent value="submit" className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Document Submission
                  </h2>
                  <p className="text-muted-foreground">
                    Submit your coffee export documents for blockchain validation
                  </p>
                </div>
                <ExportForm />
              </div>
            </TabsContent>

            {/* Track Requests Tab */}
            <TabsContent value="requests" className="p-0">
              <ExporterDashboard exporterName={exporterName} />
            </TabsContent>
          </Tabs>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Coffee Export Platform. All rights
            reserved.
          </p>
          <p className="mt-1">Powered by Hyperledger Fabric</p>
        </footer>
      </div>
    </div>
  );
};

export default ExporterPortal;