
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings } from 'lucide-react';

export interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
}

interface SidebarProps {
    header: React.ReactNode;
    items: SidebarItem[];
    activeView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    header, 
    items, 
    activeView, 
    onViewChange, 
    onLogout, 
    footer 
}) => {

    const handleNavigation = (path: string) => {
        onViewChange(path);
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-purple-200 w-64">
            {header}

            {/* Navigation Items */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {items.map((item) => {
                        const isActive = activeView === item.path;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                                        isActive
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

            {footer}

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
