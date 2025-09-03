import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Alert, AlertTitle } from './ui';
import { useAuth } from '../store';
import { 
  logAccessDenied, 
  logOrganizationViolation, 
  logRoleViolation, 
  logPermissionViolation 
} from '../utils/auditLogger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  allowedOrganizations?: string[];
  allowedRoles?: string[];
  restrictToOrganization?: boolean;
}

// Organization-specific route mappings (aligned with App routes)
const ORGANIZATION_ROUTES: Record<string, string[]> = {
  'The Mint': [
    '/nbe-dashboard',
    '/users', // Only NBE admins can manage users
    '/compliance',
    '/audit'
  ],
  'Customs Authority': [
    '/customs-dashboard',
    '/audit'
  ],
  'Coffee Quality Authority': [
    '/quality-dashboard',
    '/audit'
  ],
  'Exporter Bank': [
    '/bank-dashboard',
    '/audit'
  ],
  'Commercial Bank of Ethiopia': [
    '/bank-dashboard',
    '/audit'
  ],
  'Coffee Exporters Association': [
    '/exporter-dashboard',
    '/exports',
    '/export/new',
    '/export/manage'
    // Note: explicitly excluding /audit, /compliance, /users, /reports
  ]
};

// Default home route per organization
const ORGANIZATION_HOME: Record<string, string> = {
  'The Mint': '/nbe-dashboard',
  'Customs Authority': '/customs-dashboard',
  'Coffee Quality Authority': '/quality-dashboard',
  'Exporter Bank': '/bank-dashboard',
  'Commercial Bank of Ethiopia': '/bank-dashboard',
  'Coffee Exporters Association': '/exporter-dashboard',
};

// Role-specific route restrictions
const ROLE_RESTRICTIONS: Record<string, string[]> = {
  'NBE_ADMIN': [], // No restrictions - can access all NBE routes
  'NBE_OFFICER': ['/users'], // Cannot access user management
  'CUSTOMS_VALIDATOR': [], // No restrictions within customs routes
  'QUALITY_INSPECTOR': [], // No restrictions within quality routes  
  'BANK_VALIDATOR': [], // No restrictions within bank routes
  'EXPORTER': ['/compliance', '/users', '/reports', '/alerts'], // Restrict access to administrative components
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [],
  allowedOrganizations = [],
  allowedRoles = [],
  restrictToOrganization = true
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User must exist for further checks
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check organization-specific route access with enhanced security
  if (restrictToOrganization && user.organization) {
    const allowedRoutes = ORGANIZATION_ROUTES[user.organization] || [];
    const currentPath = location.pathname;
    
    // Check if current route is allowed for user's organization
    const isRouteAllowed = allowedRoutes.some(route => 
      currentPath.startsWith(route) || currentPath === route
    );
    
    // Allow public routes and organization-specific routes
    const isPublicRoute = [
      '/login',
      '/',
      '/dashboard' // Basic dashboard access
    ].some(route => currentPath === route);
    
    // Enhanced validation: Detect cross-organization dashboard access attempts
    const isAttemptingCrossOrgAccess = [
      '/nbe-dashboard',
      '/customs-dashboard',
      '/quality-dashboard',
      '/bank-dashboard',
      '/exporter-dashboard'
    ].some(orgRoute => currentPath.startsWith(orgRoute)) && !isRouteAllowed;
    
    if (isAttemptingCrossOrgAccess) {
      // Critical security violation - attempting to access another org's dashboard
      logOrganizationViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        location.pathname,
        allowedRoutes
      );
      
      // Additional security logging
      console.warn(`SECURITY ALERT: Cross-organization access attempt`, {
        userId: user.id,
        userName: user.name,
        userOrg: user.organization,
        userRole: user.role,
        attemptedPath: currentPath,
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL'
      });
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
    
    if (!isRouteAllowed && !isPublicRoute) {
      // Log unauthorized access attempt
      console.warn(`Unauthorized access attempt: User ${user.name} (${user.organization}) tried to access ${currentPath}`);
      
      // Log organization violation
      logOrganizationViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        currentPath,
        allowedRoutes
      );
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
  }

  // Check role-specific restrictions
  if (user.role && ROLE_RESTRICTIONS[user.role]) {
    const restrictedRoutes = ROLE_RESTRICTIONS[user.role];
    const currentPath = location.pathname;
    
    const isRestricted = restrictedRoutes.some(route => 
      currentPath.startsWith(route) || currentPath === route
    );
    
    if (isRestricted) {
      // Log role violation
      logRoleViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        currentPath,
        [] // No specific allowed roles for this check
      );
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
  }

  // Check allowed organizations
  if (allowedOrganizations.length > 0 && user.organization) {
    if (!allowedOrganizations.includes(user.organization)) {
      // Log organization violation
      logOrganizationViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        location.pathname,
        allowedOrganizations
      );
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
  }

  // Check allowed roles
  if (allowedRoles.length > 0 && user.role) {
    if (!allowedRoles.includes(user.role)) {
      // Log role violation
      logRoleViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        location.pathname,
        allowedRoles
      );
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.some(permission =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      // Log permission violation
      logPermissionViolation(
        user.id,
        user.name,
        user.role,
        user.organization,
        location.pathname,
        requiredPermissions,
        user.permissions
      );
      
      const home = ORGANIZATION_HOME[user.organization] || '/dashboard';
      return <Navigate to={home} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;