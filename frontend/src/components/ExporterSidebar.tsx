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
    <div className="flex flex-col h-full bg-white border-r border-purple-200 w-64">
      {/* Sidebar Header */}
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
                      ? 'bg-purple-100 text-purple-700 font-medium border border-purple-200'
                      : 'text-black hover:bg-yellow-50 hover:border hover:border-yellow-200'
                  }`}
                >
                  <span className={isActive ? 'text-purple-600' : 'text-purple-500'}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-purple-200">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50"
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