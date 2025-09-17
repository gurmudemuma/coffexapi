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
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApproversApp() {
  const navigate = useNavigate();
  
  // Redirect to login page since we're using individual dashboards now
  React.useEffect(() => {
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

type OrganizationType = 'national-bank' | 'customs' | 'quality-authority' | 'exporter-bank';
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
  'quality-authority': {
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
