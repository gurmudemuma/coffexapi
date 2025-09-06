import React, { useState, useEffect } from 'react';
import { MultiChannelApproversPanel } from './components/MultiChannelApproversPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { 
  Building, 
  Shield, 
  Award, 
  Truck, 
  LogOut, 
  Bell,
  Settings,
  User,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

type OrganizationType = 'national-bank' | 'customs' | 'coffee-authority' | 'exporter-bank';
type UserRole = 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';

interface UserInfo {
  name: string;
  role: string;
  organization: string;
  userRole: UserRole;
}

interface OrganizationConfig {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  allowedRoles: UserRole[];
  channelDescription: string;
}

const ORGANIZATIONS: Record<OrganizationType, OrganizationConfig> = {
  'national-bank': {
    name: 'National Bank',
    icon: Building,
    color: 'blue',
    description: 'License Validation Authority',
    allowedRoles: ['APPROVER'],
    channelDescription: 'Private channel for export license validation and regulatory oversight'
  },
  'customs': {
    name: 'Customs Authority',
    icon: Shield, 
    color: 'green',
    description: 'Shipping Documentation Authority',
    allowedRoles: ['APPROVER'],
    channelDescription: 'Secure channel for import/export documentation and customs verification'
  },
  'coffee-authority': {
    name: 'Coffee Quality Authority',
    icon: Award,
    color: 'purple', 
    description: 'Quality Certification Authority',
    allowedRoles: ['APPROVER'],
    channelDescription: 'Dedicated channel for coffee quality certification and standards compliance'
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    icon: Truck,
    color: 'orange',
    description: 'Invoice Validation & Banking Supervision',
    allowedRoles: ['APPROVER', 'BANK', 'BANK_SUPERVISOR'],
    channelDescription: 'Multi-role channel for invoice validation and global banking supervision'
  }
};

export default function ApproversApp() {
  const [selectedOrg, setSelectedOrg] = useState<OrganizationType | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('APPROVER');
  const [user, setUser] = useState<UserInfo>({
    name: 'John Doe',
    role: 'Senior Validator',
    organization: '',
    userRole: 'APPROVER'
  });

  const handleOrgSelection = (orgType: OrganizationType) => {
    setSelectedOrg(orgType);
    // Reset role to first available for this organization
    const firstRole = ORGANIZATIONS[orgType].allowedRoles[0];
    setSelectedRole(firstRole);
    setUser(prev => ({
      ...prev,
      organization: ORGANIZATIONS[orgType].name,
      userRole: firstRole,
      role: getRoleDisplayName(firstRole)
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setUser(prev => ({
      ...prev,
      userRole: role,
      role: getRoleDisplayName(role)
    }));
    toast.success(`Switched to ${getRoleDisplayName(role)} mode`);
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'APPROVER': return 'Document Approver';
      case 'BANK': return 'Bank Officer';
      case 'BANK_SUPERVISOR': return 'Bank Supervisor';
      default: return 'User';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'BANK_SUPERVISOR': return Crown;
      case 'BANK': return Building;
      default: return User;
    }
  };

  const handleLogout = () => {
    setSelectedOrg(null);
    setSelectedRole('APPROVER');
    setUser({
      name: 'John Doe',
      role: 'Senior Validator',
      organization: '',
      userRole: 'APPROVER'
    });
  };

  if (!selectedOrg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-800">
                MULTI-CHANNEL COFFEE EXPORT PLATFORM
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Document Approval System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure blockchain-based document validation with dedicated private channels for each organization
            </p>
          </div>

          {/* Organization Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Select Your Organization Channel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(ORGANIZATIONS).map(([key, org]) => {
                const Icon = org.icon;
                const hasMultipleRoles = org.allowedRoles.length > 1;
                
                return (
                  <Card 
                    key={key}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-blue-200"
                    onClick={() => handleOrgSelection(key as OrganizationType)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${org.color}-100 flex items-center justify-center relative`}>
                        <Icon className={`w-8 h-8 text-${org.color}-600`} />
                        {hasMultipleRoles && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{org.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{org.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center mb-3">
                        {org.allowedRoles.map(role => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {getRoleDisplayName(role)}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {org.channelDescription}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* System Features */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
              Multi-Channel Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Private Approval Channels</h4>
                <p className="text-sm text-gray-600">
                  Each organization has a dedicated private channel for document approval workflows
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Bank Supervisor Oversight</h4>
                <p className="text-sm text-gray-600">
                  Global visibility and monitoring of all export approvals and progress
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Role-Based Access</h4>
                <p className="text-sm text-gray-600">
                  Granular permissions ensure users only see documents relevant to their role
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-sm text-gray-500">
            <p>© 2024 Multi-Channel Coffee Export Platform. All rights reserved.</p>
            <p className="mt-1">Powered by Hyperledger Fabric with Private Data Collections</p>
          </div>
        </div>
      </div>
    );
  }

  const currentOrg = ORGANIZATIONS[selectedOrg];
  const Icon = currentOrg.icon;
  const RoleIcon = getRoleIcon(selectedRole);
  const canChangeRole = currentOrg.allowedRoles.length > 1;

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
              {/* Role Selector for organizations with multiple roles */}
              {canChangeRole && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Role:</span>
                  <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentOrg.allowedRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="w-4 h-4" />
                            <span>{getRoleDisplayName(role)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${
                  selectedRole === 'BANK_SUPERVISOR' ? 'bg-yellow-100' : 'bg-gray-200'
                } flex items-center justify-center`}>
                  <RoleIcon className={`w-4 h-4 ${
                    selectedRole === 'BANK_SUPERVISOR' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
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
      <MultiChannelApproversPanel 
        organizationType={selectedOrg} 
        userRole={selectedRole}
      />
    </div>
  );
}