import { useEffect } from 'react';
import { useAuth } from '../store';
import { getOrganizationBranding, getOrganizationKey } from '../config/organizationBranding';

/**
 * Custom hook for managing organization-specific titles and portal information
 * Automatically updates document title based on user's organization and current page
 */
export const useOrganizationTitle = (pageTitle?: string, includeOrgName: boolean = true) => {
  const { user } = useAuth();
  
  // Get organization branding based on user's organization
  const orgBranding = user?.organization 
    ? getOrganizationBranding(user.organization)
    : null;
  
  const orgKey = user?.organization 
    ? getOrganizationKey(user.organization)
    : 'national-bank';

  // Generate page title
  const generateTitle = () => {
    if (!orgBranding) {
      return 'Coffee Export Platform';
    }

    const parts: string[] = [];
    
    if (pageTitle) {
      parts.push(pageTitle);
    } else {
      parts.push(orgBranding.dashboardTitle);
    }
    
    if (includeOrgName) {
      parts.push(orgBranding.name);
    }
    
    return parts.join(' - ');
  };

  // Update document title
  useEffect(() => {
    const title = generateTitle();
    document.title = title;
    
    // Cleanup on unmount
    return () => {
      document.title = 'Coffee Export Platform';
    };
  }, [user?.organization, pageTitle, includeOrgName]);

  return {
    orgBranding,
    orgKey,
    fullTitle: generateTitle(),
    portalName: orgBranding?.name || 'Coffee Export Platform',
    fullName: orgBranding?.fullName || 'Coffee Export Platform',
    subtitle: orgBranding?.subtitle || 'Export Management Portal',
    description: orgBranding?.description || 'Coffee export management platform',
    dashboardTitle: orgBranding?.dashboardTitle || 'Dashboard',
    portalType: orgBranding?.portalType || 'Platform'
  };
};

/**
 * Hook specifically for dashboard pages
 */
export const useDashboardTitle = () => {
  return useOrganizationTitle();
};

/**
 * Hook for specific page titles
 */
export const usePageTitle = (pageTitle: string, includeOrgName: boolean = true) => {
  return useOrganizationTitle(pageTitle, includeOrgName);
};

export default useOrganizationTitle;