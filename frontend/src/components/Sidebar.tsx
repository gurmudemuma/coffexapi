
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, ChevronDown } from 'lucide-react';

export interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
    subItems?: SidebarItem[];
}

interface SidebarProps {
    header: React.ReactNode;
    items: SidebarItem[];
    activeView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    footer?: React.ReactNode;
}

const SidebarSubItem: React.FC<{ item: SidebarItem, onNavigate: (path: string) => void, activeView: string }> = ({ item, onNavigate, activeView }) => {
    const isActive = activeView === item.path;
    return (
        <li>
            <button
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between pl-8 pr-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-black hover:bg-yellow-50'
                    }`}
            >
                <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-purple-600' : 'text-purple-500'}>
                        {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                </div>
            </button>
        </li>
    );
};

const SidebarItem: React.FC<{ item: SidebarItem, onNavigate: (path: string) => void, activeView: string }> = ({ item, onNavigate, activeView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = activeView === item.path;

    const handleClick = () => {
        if (hasSubItems) {
            setIsOpen(!isOpen);
        } else {
            onNavigate(item.path);
        }
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive && !hasSubItems
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
                <div className="flex items-center">
                    {item.badge && item.badge > 0 && (
                        <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-xs mr-2">
                            {item.badge}
                        </Badge>
                    )}
                    {hasSubItems && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                </div>
            </button>
            {hasSubItems && isOpen && (
                <ul className="space-y-1 mt-1">
                    {item.subItems?.map(subItem => (
                        <SidebarSubItem key={subItem.id} item={subItem} onNavigate={onNavigate} activeView={activeView} />
                    ))}
                </ul>
            )}
        </li>
    );
};

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
                    {items.map((item) => (
                        <SidebarItem key={item.id} item={item} onNavigate={handleNavigation} activeView={activeView} />
                    ))}
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
