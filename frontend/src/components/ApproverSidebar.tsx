import React from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ApproverSidebarProps {
  organizationName?: string;
  roleLabel?: string;
  onLogout: () => void;
  onSelect?: (id: string) => void;
}

const items: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <FileText className="w-5 h-5" /> },
  { id: 'pending', label: 'Pending Approvals', icon: <Clock className="w-5 h-5" /> },
  { id: 'urgent', label: 'Urgent Reviews', icon: <Bell className="w-5 h-5" /> },
  { id: 'approved', label: 'Approved Documents', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'rejected', label: 'Rejected Documents', icon: <XCircle className="w-5 h-5" /> },
  { id: 'search', label: 'Document Search', icon: <Search className="w-5 h-5" /> },
  { id: 'activity', label: 'Activity Log', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
];

const ApproverSidebar: React.FC<ApproverSidebarProps> = ({
  organizationName = 'Exporter Bank',
  roleLabel = 'APPROVER',
  onLogout,
  onSelect,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-56">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-xl font-bold text-purple-700">Approver Portal</h2>
        <p className="text-sm text-gray-600 truncate">{organizationName}</p>
        <p className="text-xs text-gray-400">{roleLabel}</p>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2.5">
        <div className="bg-purple-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-lg font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-gray-500">Urgent</p>
          <p className="text-lg font-semibold text-gray-900">0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect?.(item.id)}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer section */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default ApproverSidebar;
