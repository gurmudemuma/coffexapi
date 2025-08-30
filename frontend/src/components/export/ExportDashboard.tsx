import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Badge } from '../ui';
import { Button } from '../ui/StandardComponents';
import { 
  Coffee as CoffeeIcon,
  Assignment as AssignmentIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { ExportStats } from '../../types/export';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ExportDashboardProps {
  stats: ExportStats;
  onNewExport: () => void;
  onViewExports: () => void;
  onViewAuditTrail: () => void;
  orgBranding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    chartColors: string[];
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  trend 
}) => (
  <Card className={`border-l-4 border-l-[${color}]`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-[${color}]/10`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-6 w-6 text-[${color}]` 
          })}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ExportDashboard: React.FC<ExportDashboardProps> = ({
  stats,
  onNewExport,
  onViewExports,
  onViewAuditTrail,
  orgBranding,
  className = ''
}) => {
  const navigate = useNavigate();

  // Enhanced button handlers with navigation
  const handleNewExport = () => {
    if (onNewExport) {
      onNewExport();
    } else {
      navigate('/exports/new');
    }
  };

  const handleViewExports = () => {
    if (onViewExports) {
      onViewExports();
    } else {
      navigate('/exports?tab=manage');
    }
  };

  const handleViewAuditTrail = () => {
    if (onViewAuditTrail) {
      onViewAuditTrail();
    } else {
      navigate('/audit');
    }
  };

  const handleViewExportDetails = (exportId: string) => {
    navigate(`/exports/${exportId}`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CoffeeIcon className={`h-8 w-8 text-[${orgBranding.primaryColor}]`} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Export Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Welcome back! Manage your coffee export requests and track their progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="primary" 
            onClick={handleNewExport}
            className="flex items-center gap-2"
          >
            <AddIcon className="h-5 w-5" />
            New Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Exports"
          value={stats.totalExports}
          icon={<AssignmentIcon />}
          color={orgBranding.primaryColor}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={stats.activeExports}
          icon={<PendingIcon />}
          color={orgBranding.accentColor}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Approved"
          value={stats.approvedExports}
          icon={<CheckCircleIcon />}
          color="#10B981" // Green-500
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={<MoneyIcon />}
          color={orgBranding.chartColors?.[2] || '#3B82F6'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button 
          variant="outline" 
          onClick={handleViewExports}
          className="h-full p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 hover:border-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.primaryColor}]/5 transition-colors"
        >
          <ListIcon className="h-8 w-8 mb-2 text-gray-400" />
          <span className="font-medium">View All Exports</span>
          <span className="text-sm text-gray-500 mt-1">Manage your export requests</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleViewAuditTrail}
          className="h-full p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 hover:border-[${orgBranding.accentColor}] hover:bg-[${orgBranding.accentColor}]/5 transition-colors"
        >
          <TrendingUpIcon className="h-8 w-8 mb-2 text-gray-400" />
          <span className="font-medium">Audit Trail</span>
          <span className="text-sm text-gray-500 mt-1">View export history and logs</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleNewExport}
          className="h-full p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <AddIcon className="h-8 w-8 mb-2 text-green-500" />
          <span className="font-medium">Create New Export</span>
          <span className="text-sm text-gray-500 mt-1">Start a new export request</span>
        </Button>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleViewAuditTrail}
            className="text-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.primaryColor}]/10"
          >
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <AssignmentIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Export #{1000 + item} created</p>
                      <p className="text-sm text-gray-500">
                        {item === 1 ? 'Just now' : `${item} hours ago`} • 
                        <span className="ml-1">
                          <Badge variant={item % 2 === 0 ? 'success' : 'warning'}>
                            {item % 2 === 0 ? 'Approved' : 'Pending'}
                          </Badge>
                        </span>
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleViewExportDetails(`EXP-${1000 + item}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
