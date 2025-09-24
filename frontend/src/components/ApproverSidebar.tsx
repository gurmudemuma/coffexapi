import React from 'react';
import {
    CheckCircle,
    FileText,
    Shield,
    Archive,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { getSidebarItems, SidebarItem } from '../config/sidebarConfig.tsx';

interface ApproverSidebarProps {
    organizationName: string;
    organizationType: string;
    userRole?: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    pendingCount?: number;
}

export const ApproverSidebar: React.FC<ApproverSidebarProps> = ({
    organizationName,
    organizationType,
    userRole = 'APPROVER',
    onViewChange,
    onLogout,
    pendingCount = 0,
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

    const sidebarItems = getSidebarItems(organizationType).map(item => 
        item.id === 'pending-approvals' ? { ...item, badge: pendingCount } : item
    );

    const header = (
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
    );

    const footer = (
        <div className="p-4 border-b border-purple-100">
            <div className="grid grid-cols-1 gap-2">
                <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    <p className="text-xs text-purple-600 font-medium">Pending</p>
                    <p className="text-lg font-bold text-black">{pendingCount}</p>
                </div>
            </div>
        </div>
    );

    return (
        <Sidebar 
            header={header}
            items={sidebarItems}
            onViewChange={() => {}}
            onLogout={onLogout}
            footer={footer}
        />
    );
};

export default ApproverSidebar;