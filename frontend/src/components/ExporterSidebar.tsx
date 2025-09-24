import React from 'react';
import { 
  FileText, 
  Plus, 
  LogOut,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  FolderOpen,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarItem } from './Sidebar';

interface ExporterSidebarProps {
  exporterName?: string;
  onLogout: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const ExporterSidebar: React.FC<ExporterSidebarProps> = ({ 
  exporterName = "Coffee Exporter Co.",
  onLogout,
  activeView,
  onViewChange
}) => {

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: 'dashboard'
    },
    {
      id: 'new-export',
      label: 'New Export Request',
      icon: <Plus className="w-5 h-5" />,
      path: 'submit'
    },
    {
      id: 'my-requests',
      label: 'My Requests',
      icon: <FileText className="w-5 h-5" />,
      path: 'requests',
      subItems: [
        { id: 'pending-requests', label: 'Pending', path: 'requests-pending', icon: <Clock className="w-5 h-5" /> },
        { id: 'approved-requests', label: 'Approved', path: 'requests-approved', icon: <CheckCircle className="w-5 h-5" /> },
        { id: 'rejected-requests', label: 'Rejected', path: 'requests-rejected', icon: <XCircle className="w-5 h-5" /> },
      ]
    },
    {
      id: 'document-hub',
      label: 'Document Hub',
      icon: <FolderOpen className="w-5 h-5" />,
      path: 'documents'
    },
    {
      id: 'help',
      label: 'Help / Support',
      icon: <HelpCircle className="w-5 h-5" />,
      path: 'help'
    }
  ];

  const header = (
    <div className="p-4 border-b border-purple-200 bg-purple-50">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black">Exporter Portal</h2>
        </div>
      </div>
      <p className="text-sm text-purple-600 font-medium truncate">{exporterName}</p>
      <p className="text-xs text-purple-500">EXPORTER</p>
    </div>
  );

  return (
    <Sidebar 
      header={header}
      items={sidebarItems}
      activeView={activeView}
      onViewChange={onViewChange}
      onLogout={onLogout}
    />
  );
};

export default ExporterSidebar;