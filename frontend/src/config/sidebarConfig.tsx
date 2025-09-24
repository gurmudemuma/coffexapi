
import {
    Home,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Search,
    Activity,
    BarChart3,
    Bell,
    Shield,
    Archive,
    Award,
    Landmark,
    Scale,
    Briefcase,
    FileStack,
    FileCheck,
    FileX,
    Building2,
    Network
  } from 'lucide-react';
  
  export interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
    subItems?: SidebarItem[];
  }
  
  const commonItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: 'dashboard',
    },
    {
      id: 'pending-approvals',
      label: 'Pending',
      icon: <Clock className="w-5 h-5" />,
      path: 'pending',
    },
    {
      id: 'approved-documents',
      label: 'Approved',
      icon: <CheckCircle className="w-5 h-5" />,
      path: 'approved',
    },
    {
      id: 'rejected-documents',
      label: 'Rejected',
      icon: <XCircle className="w-5 h-5" />,
      path: 'rejected',
    },
  ];
  
  const nationalBankSidebar: SidebarItem[] = [
    ...commonItems,
    {
      id: 'user-management',
      label: 'User Management',
      icon: <Briefcase className="w-5 h-5" />,
      path: 'user-management',
    },
    {
      id: 'license-management',
      label: 'License Management',
      icon: <Landmark className="w-5 h-5" />,
      path: 'license-management',
      subItems: [
        { id: 'new-applications', label: 'New Applications', path: 'new-applications', icon: <FileStack className="w-5 h-5" /> },
        { id: 'issued-licenses', label: 'Issued Licenses', path: 'issued-licenses', icon: <FileCheck className="w-5 h-5" /> },
        { id: 'revoked-licenses', label: 'Revoked Licenses', path: 'revoked-licenses', icon: <FileX className="w-5 h-5" /> },
      ],
    },
    {
      id: 'regulatory-compliance',
      label: 'Regulatory Compliance',
      icon: <Scale className="w-5 h-5" />,
      path: 'regulatory-compliance',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: 'analytics',
    },
    {
      id: 'system-health',
      label: 'System Health',
      icon: <Network className="w-5 h-5" />,
      path: 'system-health',
    },
  ];
  
  const customsSidebar: SidebarItem[] = [
    ...commonItems,
    {
      id: 'shipment-verification',
      label: 'Shipment Verification',
      icon: <Archive className="w-5 h-5" />,
      path: 'shipment-verification',
    },
    {
      id: 'document-search',
      label: 'Document Search',
      icon: <Search className="w-5 h-5" />,
      path: 'search',
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: <Activity className="w-5 h-5" />,
      path: 'activity',
    },
  ];
  
  const coffeeAuthoritySidebar: SidebarItem[] = [
    ...commonItems,
    {
      id: 'quality-certification',
      label: 'Quality Certification',
      icon: <Award className="w-5 h-5" />,
      path: 'quality-certification',
    },
    {
      id: 'document-search',
      label: 'Document Search',
      icon: <Search className="w-5 h-5" />,
      path: 'search',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: 'analytics',
    },
  ];
  
  const exporterBankSidebar: SidebarItem[] = [
    ...commonItems,
    {
      id: 'invoice-verification',
      label: 'Invoice Verification',
      icon: <Briefcase className="w-5 h-5" />,
      path: 'invoice-verification',
    },
    {
      id: 'document-search',
      label: 'Document Search',
      icon: <Search className="w-5 h-5" />,
      path: 'search',
    },
    {
      id: 'activity-log',
      label: 'Activity Log',
      icon: <Activity className="w-5 h-5" />,
      path: 'activity',
    },
  ];
  
  export const getSidebarItems = (organizationType: string): SidebarItem[] => {
    switch (organizationType) {
      case 'national-bank':
        return nationalBankSidebar;
      case 'customs':
        return customsSidebar;
      case 'coffee-authority':
        return coffeeAuthoritySidebar;
      case 'exporter-bank':
        return exporterBankSidebar;
      default:
        return commonItems;
    }
  };
  