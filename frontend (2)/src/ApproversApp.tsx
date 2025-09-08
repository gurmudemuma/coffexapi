import React, { useState } from 'react';
import ApproversPanel from './components/ApproversPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { 
  Building, 
  Shield, 
  Award, 
  Truck, 
  LogOut, 
  Bell,
  Settings,
  User
} from 'lucide-react';

type OrganizationType = 'national-bank' | 'customs' | 'quality-authority' | 'exporter-bank';

const ORGANIZATIONS = {
  'national-bank': {
    name: 'National Bank',
    icon: Building,
    color: 'blue',
    description: 'License Validation Authority'
  },
  'customs': {
    name: 'Customs Authority',
    icon: Shield, 
    color: 'green',
    description: 'Shipping Documentation Authority'
  },
  'quality-authority': {
    name: 'Coffee Quality Authority',
    icon: Award,
    color: 'purple', 
    description: 'Quality Certification Authority'
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    icon: Truck,
    color: 'orange',
    description: 'Invoice Validation Authority'
  }
};

export default function ApproversApp() {
  const [selectedOrg, setSelectedOrg] = useState<OrganizationType | null>(null);
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'Senior Validator',
    organization: ''
  });

  const handleOrgSelection = (orgType: OrganizationType) => {
    setSelectedOrg(orgType);
    setUser(prev => ({
      ...prev,
      organization: ORGANIZATIONS[orgType].name
    }));
  };

  const handleLogout = () => {
    setSelectedOrg(null);
    setUser(prev => ({ ...prev, organization: '' }));
  };

  if (!selectedOrg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-800">
                COFFEE EXPORT PLATFORM
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Document Approval System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure blockchain-based document validation for coffee export stakeholders
            </p>
          </div>

          {/* Organization Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Select Your Organization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(ORGANIZATIONS).map(([key, org]) => {
                const Icon = org.icon;
                return (
                  <Card 
                    key={key}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-blue-200"
                    onClick={() => handleOrgSelection(key as OrganizationType)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${org.color}-100 flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 text-${org.color}-600`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{org.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{org.description}</p>
                      <Badge variant={org.color as any} className="text-xs">
                        Document Validator
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* System Features */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
              Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Secure Validation</h4>
                <p className="text-sm text-gray-600">
                  Blockchain-secured document authentication and approval workflow
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Real-time Notifications</h4>
                <p className="text-sm text-gray-600">
                  Instant alerts for new documents requiring validation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Audit Trail</h4>
                <p className="text-sm text-gray-600">
                  Complete immutable record of all validation decisions
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-sm text-gray-500">
            <p>© 2024 Coffee Export Platform. All rights reserved.</p>
            <p className="mt-1">Powered by Hyperledger Fabric</p>
          </div>
        </div>
      </div>
    );
  }

  const currentOrg = ORGANIZATIONS[selectedOrg];
  const Icon = currentOrg.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full bg-${currentOrg.color}-100 flex items-center justify-center mr-3`}>
                <Icon className={`w-5 h-5 text-${currentOrg.color}-600`} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{currentOrg.name}</h1>
                <p className="text-sm text-gray-500">{currentOrg.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.role}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Switch Org
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ApproversPanel organizationType={selectedOrg} />
    </div>
  );
}