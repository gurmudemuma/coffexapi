import React from 'react';
import { Card, CardContent } from '../ui';
import { Coffee as CoffeeIcon } from '@mui/icons-material';

interface SimplifiedExporterDashboardProps {
  orgBranding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  className?: string;
}

export const SimplifiedExporterDashboard: React.FC<SimplifiedExporterDashboardProps> = ({
  orgBranding,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CoffeeIcon className="h-8 w-8" style={{ color: orgBranding.primaryColor }} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coffee Export Platform</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Secure, efficient, and transparent coffee export documentation management
        </p>
      </div>

      {/* Professional Welcome Content with Improved Branding */}
      <div className="max-w-4xl mx-auto">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exporter Dashboard</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Manage your coffee export documentation efficiently through our blockchain-secured platform. 
                Follow the steps below to initiate new exports or monitor existing requests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                   style={{ 
                     backgroundColor: 'white',
                     borderColor: orgBranding.primaryColor,
                     boxShadow: `0 0 0 1px ${orgBranding.primaryColor}`
                   }}>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                       style={{ backgroundColor: `${orgBranding.primaryColor}20` }}>
                    <span className="font-bold" style={{ color: orgBranding.primaryColor }}>1</span>
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: orgBranding.primaryColor }}>
                    Create Export Request
                  </h3>
                </div>
                <p className="mb-4 text-gray-700">
                  Begin a new export process by providing essential shipment details and uploading required documentation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Complete export application form</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Upload quality certificates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Submit shipping documents</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 rounded-lg border transition-all duration-200 hover:shadow-md" 
                   style={{ 
                     backgroundColor: 'white',
                     borderColor: orgBranding.secondaryColor,
                     boxShadow: `0 0 0 1px ${orgBranding.secondaryColor}`
                   }}>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                       style={{ backgroundColor: `${orgBranding.secondaryColor}20` }}>
                    <span className="font-bold" style={{ color: orgBranding.secondaryColor }}>2</span>
                  </div>
                  <h3 className="font-semibold text-lg" style={{ color: orgBranding.secondaryColor }}>
                    Manage Existing Exports
                  </h3>
                </div>
                <p className="mb-4 text-gray-700">
                  Track the progress of your export requests and access validated documentation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Monitor validation status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">View approval history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Download certified documents</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Platform Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.primaryColor }}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Enhanced Security</h4>
                    <p className="text-gray-600 text-sm">Blockchain-secured documentation prevents fraud</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.secondaryColor }}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Real-time Tracking</h4>
                    <p className="text-gray-600 text-sm">Monitor export progress at every stage</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: orgBranding.accentColor }}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Regulatory Compliance</h4>
                    <p className="text-gray-600 text-sm">Ensure adherence to international trade standards</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                For technical support or assistance with export documentation, contact our dedicated team at support@coffeeexport.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};