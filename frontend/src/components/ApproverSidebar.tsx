import React from 'react';
import {
    CheckCircle,
    Clock,
    FileText,
    Activity,
    BarChart3,
    Settings,
    LogOut,
    Shield,
    AlertTriangle,
    Archive,
    Search,
    Bell,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
    color?: string;
}

interface ApproverSidebarProps {
    organizationName: string;
    organizationType: string;
    userRole?: string;
    activeView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    pendingCount?: number;
    urgentCount?: number;
}

export const ApproverSidebar: React.FC<ApproverSidebarProps> = ({
    organizationName,
    organizationType,
    userRole = 'APPROVER',
    activeView,
    onViewChange,
    onLogout,
    pendingCount = 0,
    urgentCount = 0
}) => {

    const getOrganizationIcon = () => {
        switch (organizationType) {
            case 'national-bank':
                return <Shield className="w-6 h-6" />;
            case 'exporter-bank':
                return <FileText className="w-6 h-6" />;
            case 'coffee-authority':
                return <CheckCircle className="w-6 h-6" />;
            case 'customs':
                return <Archive className="w-6 h-6" />;
            default:
                return <Shield className="w-6 h-6" />;
        }
    };

    const sidebarItems: SidebarItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home className="w-5 h-5" />,
            path: 'dashboard'
        },
        {
            id: 'pending-approvals',
            label: 'Pending Approvals',
            icon: <Clock className="w-5 h-5" />,
            path: 'pending',
            badge: pendingCount,
            color: 'purple'
        },
        {
            id: 'urgent-reviews',
            label: 'Urgent Reviews',
            icon: <AlertTriangle className="w-5 h-5" />,
            path: 'urgent',
            badge: urgentCount,
            color: 'purple'
        },
        {
            id: 'approved-documents',
            label: 'Approved Documents',
            icon: <CheckCircle className="w-5 h-5" />,
            path: 'approved'
        },
        {
            id: 'rejected-documents',
            label: 'Rejected Documents',
            icon: <FileText className="w-5 h-5" />,
            path: 'rejected'
        },
        {
            id: 'document-search',
            label: 'Document Search',
            icon: <Search className="w-5 h-5" />,
            path: 'search'
        },
        {
            id: 'activity-log',
            label: 'Activity Log',
            icon: <Activity className="w-5 h-5" />,
            path: 'activity'
        },
        {
            id: 'analytics',
            label: 'Analytics & Reports',
            icon: <BarChart3 className="w-5 h-5" />,
            path: 'analytics'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <Bell className="w-5 h-5" />,
            path: 'notifications'
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
                        {getOrganizationIcon()}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-black">Approver Portal</h2>
                    </div>
                </div>
                <p className="text-sm text-purple-600 font-medium">{organizationName}</p>
                <p className="text-xs text-purple-500">{userRole}</p>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-purple-100">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                        <p className="text-xs text-purple-600 font-medium">Pending</p>
                        <p className="text-lg font-bold text-black">{pendingCount}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-600 font-medium">Urgent</p>
                        <p className="text-lg font-bold text-purple-600">{urgentCount}</p>
                    </div>
                </div>
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
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${isActive
                                            ? 'bg-purple-100 text-purple-700 font-medium border border-purple-200'
                                            : 'text-black hover:bg-yellow-50 hover:border hover:border-yellow-200'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={isActive ? 'text-purple-600' : 'text-purple-500'}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    {item.badge && item.badge > 0 && (
                                        <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Settings and Logout */}
            <div className="p-4 border-t border-purple-200 space-y-2">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                    onClick={() => handleNavigation('settings')}
                >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </Button>

                <Button
                    className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
};

export default ApproverSidebar;