import React from 'react';
import {
  Home,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  Building,
  Shield,
  Award,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface ApproverPanelSidebarProps {
  organizationType: string;
  organizationName: string;
  userRole: string;
  onLogout: () => void;
  onNavigate?: (id: string) => void;
  pendingCount?: number;
  approvedCount?: number;
  rejectedCount?: number;
  activeSection?: string;
}

const getOrganizationIcon = (orgType: string) => {
  const icons = {
    'national-bank': Building,
    'exporter-bank': Truck,
    'coffee-authority': Award,
    'customs': Shield
  };
  return icons[orgType as keyof typeof icons] || Building;
};

const getOrganizationColor = (orgType: string) => {
  // Using consistent golden, purple, and black color scheme
  const colors = {
    'national-bank': 'bg-gradient-to-r from-purple-700 to-purple-800',
    'exporter-bank': 'bg-gradient-to-r from-yellow-600 to-amber-600',
    'coffee-authority': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'customs': 'bg-gradient-to-r from-gray-800 to-black'
  };
  return colors[orgType as keyof typeof colors] || 'bg-gradient-to-r from-purple-700 to-purple-800';
};

const ApproverPanelSidebar: React.FC<ApproverPanelSidebarProps> = ({
  organizationType,
  organizationName,
  userRole,
  onLogout,
  onNavigate,
  pendingCount = 0,
  approvedCount = 0,
  rejectedCount = 0,
  activeSection = 'dashboard'
}) => {
  const OrgIcon = getOrganizationIcon(organizationType);
  const orgColor = getOrganizationColor(organizationType);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pending', label: 'Pending Approvals', icon: Clock, badge: pendingCount },
    { id: 'approved', label: 'Approved Documents', icon: CheckCircle, badge: approvedCount },
    { id: 'rejected', label: 'Rejected Documents', icon: XCircle, badge: rejectedCount },
    { id: 'search', label: 'Document Search', icon: Search },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help / Support', icon: HelpCircle }
  ];

  const handleItemClick = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className={`${orgColor} text-white p-4`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <OrgIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Approver Portal</h2>
          </div>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-medium">{organizationName}</p>
          <p className="text-xs opacity-75">{userRole.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-purple-100 to-yellow-100 text-purple-800 shadow-sm'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-yellow-50 hover:text-purple-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-colors ${
                      activeSection === item.id 
                        ? 'text-purple-600' 
                        : 'text-gray-500 group-hover:text-purple-600'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 font-semibold ${
                        item.id === 'pending' 
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                          : item.id === 'approved'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                          : item.id === 'rejected'
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start space-x-3 px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-150"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default ApproverPanelSidebar;
