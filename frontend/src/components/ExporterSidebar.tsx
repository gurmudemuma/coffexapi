import React from 'react';
import { 
  FileText, 
  Plus, 
  Activity, 
  FolderOpen, 
  HelpCircle, 
  LogOut,
  Home,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

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
  const navigate = useNavigate();
  const location = useLocation();

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
      path: 'requests'
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

  const handleNavigation = (path: string) => {
    onViewChange(path);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Exporter Portal</h2>
        <p className="text-sm text-gray-600 truncate">{exporterName}</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = activeView === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
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

export default ExporterSidebar;