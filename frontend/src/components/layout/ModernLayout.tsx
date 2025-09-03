/**
 * Modern Layout Component
 * 
 * This component provides a standardized layout structure with integrated
 * state management, navigation, and responsive design.
 */

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  useAuth, 
  useAuthActions, 
  useUI, 
  useUIActions, 
  useNotifications,
  useNotificationActions,
  useSystemStatus 
} from '../../store';
import { 
  Card, 
  Button, 
  Badge, 
  StatusIndicator,
  Alert,
  AlertDescription 
} from '@/components/ui/StandardComponents';
import {
  Menu,
  X,
  Home,
  FileText,
  Users,
  Shield,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Coffee,
  Activity,
  AlertTriangle
} from 'lucide-react';

// ==============================================================================
// Navigation Configuration
// ==============================================================================

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  permissions?: string[];
  badge?: string;
}

const getNavigationItems = (userRole: string, userOrganization?: string): NavItem[] => {
  // For Coffee Exporters Association, show specific export-related items instead of generic dashboard
  const isExporter = userOrganization === 'Coffee Exporters Association';
  
  const baseItems: NavItem[] = isExporter ? [
    // For exporters, show specific export-related items
    {
      id: 'create-export',
      label: 'Create Export Request',
      href: '/export/new',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'view-exports',
      label: 'View All Exports',
      href: '/export/manage',
      icon: <FileText className="h-4 w-4" />,
    }
  ] : [
    // For non-exporters, show the general dashboard
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
    }
  ];

  // Organization-specific navigation items
  const organizationItems: Record<string, NavItem[]> = {
    'National Bank of Ethiopia': [
      {
        id: 'nbe-dashboard',
        label: 'NBE Control Center',
        href: '/nbe-dashboard',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'compliance',
        label: 'Compliance Monitor',
        href: '/compliance',
        icon: <Shield className="h-4 w-4" />,
        permissions: ['compliance:screen'],
      },
      {
        id: 'users',
        label: 'User Management',
        href: '/users',
        icon: <Users className="h-4 w-4" />,
        permissions: ['user:manage'],
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: <Activity className="h-4 w-4" />,
        permissions: ['audit:read'],
      },
    ],
    'Customs Authority': [
      {
        id: 'customs-dashboard',
        label: 'Customs Operations',
        href: '/customs-dashboard',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: <Activity className="h-4 w-4" />,
        permissions: ['audit:read'],
      },
    ],
    'Coffee Quality Authority': [
      {
        id: 'quality-dashboard',
        label: 'Quality Control',
        href: '/quality-dashboard',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: <Activity className="h-4 w-4" />,
        permissions: ['audit:read'],
      },
    ],
    'Exporter Bank': [
      {
        id: 'bank-dashboard',
        label: 'Banking Operations',
        href: '/bank-dashboard',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: <Activity className="h-4 w-4" />,
        permissions: ['audit:read'],
      },
    ],
    'Commercial Bank of Ethiopia': [
      {
        id: 'bank-dashboard',
        label: 'Banking Operations',
        href: '/bank-dashboard',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'audit',
        label: 'Audit Trail',
        href: '/audit',
        icon: <Activity className="h-4 w-4" />,
        permissions: ['audit:read'],
      },
    ],
    'Coffee Exporters Association': [
      // Note: intentionally not including compliance, audit trail, user management, or reports
    ],
  };

  // Get organization-specific items
  const orgItems = userOrganization ? organizationItems[userOrganization] || [] : [];
  
  // Combine base items with organization-specific items
  return [...baseItems, ...orgItems];
};

// ==============================================================================
// Header Component
// ==============================================================================

interface HeaderProps {
  // No props needed for now
}

const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const ui = useUI();
  const { setTheme } = useUIActions();
  const notifications = useNotifications();
  const { markNotificationRead } = useNotificationActions();
  const systemStatus = useSystemStatus();
  const navigate = useNavigate();
  
  // Safe theme access with fallback
  const theme = ui?.theme || 'system';
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const isSystemHealthy = Object.values(systemStatus.validators).every(status => status === 'ONLINE') &&
                          systemStatus.apiGateway === 'ONLINE' &&
                          systemStatus.blockchain === 'ONLINE' &&
                          systemStatus.ipfs === 'ONLINE';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Coffee className="h-8 w-8 text-amber-600" />
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Coffee Export Platform
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Blockchain Secured Document Validation
          </p>
        </div>
      </div>
      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        {/* System Status */}
        <div className="hidden md:flex items-center space-x-2">
          <StatusIndicator
            status={isSystemHealthy ? 'online' : 'warning'}
            size="sm"
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {isSystemHealthy ? 'All Systems Operational' : 'System Issues Detected'}
          </span>
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {themeIcons[theme]}
          </button>
          
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              {Object.entries(themeIcons).map(([themeName, icon]) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setTheme(themeName as 'light' | 'dark' | 'system');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 capitalize"
                >
                  {icon}
                  <span>{themeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                        !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                      )}
                      onClick={() => {
                        markNotificationRead(notification.id);
                        if (notification.path) {
                          navigate(notification.path);
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          'p-1 rounded-full',
                          notification.type === 'SUCCESS' && 'bg-green-100 text-green-600',
                          notification.type === 'WARNING' && 'bg-yellow-100 text-yellow-600',
                          notification.type === 'ERROR' && 'bg-red-100 text-red-600',
                          notification.type === 'INFO' && 'bg-blue-100 text-blue-600'
                        )}>
                          {notification.type === 'WARNING' || notification.type === 'ERROR' ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <Bell className="h-3 w-3" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.organization}</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Profile Settings</span>
              </button>
              
              <button
                onClick={() => {
                  handleLogout();
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ==============================================================================
// Sidebar Component
// ==============================================================================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const ui = useUI();
  const location = useLocation();
  
  const navigationItems = getNavigationItems(user?.role || '', user?.organization);
  
  const hasPermission = (permissions?: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some(permission => user?.permissions.includes(permission));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Hamburger Menu */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Coffee className="h-6 w-6 text-amber-600" />
              <span className="font-semibold text-gray-900 dark:text-white">Export Platform</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              if (!hasPermission(item.permissions)) return null;
              
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Version 2.0.0</p>
              <p>© 2024 Coffee Export Platform</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// ==============================================================================
// Main Layout Component
// ==============================================================================

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const ui = useUI();
  const { toggleSidebar } = useUIActions();
  const systemStatus = useSystemStatus();
  
  // Safe UI state access with fallbacks
  const theme = ui?.theme || 'system';
  const sidebarOpen = ui?.sidebarOpen ?? true;
  const isOffline = ui?.isOffline ?? false;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    toggleSidebar();
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const isSystemDegraded = Object.values(systemStatus.validators).some(status => status !== 'ONLINE') ||
                            systemStatus.apiGateway !== 'ONLINE' ||
                            systemStatus.blockchain !== 'ONLINE' ||
                            systemStatus.ipfs !== 'ONLINE';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* System Status Alert */}
      {isSystemDegraded && (
        <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
          <AlertDescription>
            Some system components are experiencing issues. Functionality may be limited.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Offline Alert */}
      {isOffline && (
        <Alert variant="error" className="rounded-none border-x-0 border-t-0">
          <AlertDescription>
            You are currently offline. Some features may not be available.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex h-screen">
        {/* Hamburger Menu Button in Header */}
        <button
          onClick={handleMenuToggle}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-md lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Sidebar - Show for all authenticated users */}
        <Sidebar 
          isOpen={sidebarOpen || isMobileMenuOpen} 
          onClose={() => {
            setIsMobileMenuOpen(false);
            if (window.innerWidth < 1024) {
              toggleSidebar();
            }
          }} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 mt-16 lg:mt-0">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;