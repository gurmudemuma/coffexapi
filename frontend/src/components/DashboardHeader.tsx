
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  userName: string;
  onRefresh: () => void;
  onLogout: () => void;
  refreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle, 
  userName, 
  onRefresh, 
  onLogout, 
  refreshing 
}) => {
  return (
    <header className="bg-purple-900 border-b border-yellow-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">{title}</h1>
          <p className="text-purple-300">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold">
              {userName.charAt(0)}
            </div>
            <span className="font-medium text-yellow-400">{userName}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
