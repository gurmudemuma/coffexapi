// Organization Branding Configuration
// This file defines the visual identity for each organization in the Coffee Export Platform

export interface OrganizationBranding {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logoColor: string;
  chartColors: string[];
  gradient: string;
  boxShadow: string;
}

export const ORGANIZATION_BRANDING: Record<string, OrganizationBranding> = {
  'national-bank': {
    name: 'National Bank of Ethiopia',
    primaryColor: '#1565c0', // Deep blue
    secondaryColor: '#0d47a1', // Darker blue
    accentColor: '#64b5f6', // Light blue
    backgroundColor: '#f8f9fa', // Light gray
    textColor: '#0d47a1',
    logoColor: '#1565c0',
    chartColors: ['#1565c0', '#0d47a1', '#64b5f6', '#bbdefb', '#e3f2fd'],
    gradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
    boxShadow: '0 4px 6px rgba(21, 101, 192, 0.1)'
  },
  'customs': {
    name: 'Customs Authority',
    primaryColor: '#2e7d32', // Deep green
    secondaryColor: '#1b5e20', // Darker green
    accentColor: '#81c784', // Light green
    backgroundColor: '#f1f8e9', // Light green background
    textColor: '#1b5e20',
    logoColor: '#2e7d32',
    chartColors: ['#2e7d32', '#1b5e20', '#81c784', '#c8e6c9', '#e8f5e9'],
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    boxShadow: '0 4px 6px rgba(46, 125, 50, 0.1)'
  },
  'quality-authority': {
    name: 'Coffee Quality Authority',
    primaryColor: '#7b1fa2', // Deep purple
    secondaryColor: '#4a148c', // Darker purple
    accentColor: '#ba68c8', // Light purple
    backgroundColor: '#fce4ec', // Light pink background
    textColor: '#4a148c',
    logoColor: '#7b1fa2',
    chartColors: ['#7b1fa2', '#4a148c', '#ba68c8', '#e1bee7', '#f8bbd0'],
    gradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
    boxShadow: '0 4px 6px rgba(123, 31, 162, 0.1)'
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    primaryColor: '#f57c00', // Deep orange
    secondaryColor: '#e65100', // Darker orange
    accentColor: '#ffb74d', // Light orange
    backgroundColor: '#fff3e0', // Light orange background
    textColor: '#e65100',
    logoColor: '#f57c00',
    chartColors: ['#f57c00', '#e65100', '#ffb74d', '#ffcc80', '#fff3e0'],
    gradient: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
    boxShadow: '0 4px 6px rgba(245, 124, 0, 0.1)'
  },
  'coffee-exporters': {
    name: 'Coffee Exporters Association',
    primaryColor: '#8bc34a', // Green
    secondaryColor: '#689f38', // Darker green
    accentColor: '#c5e1a5', // Light green
    backgroundColor: '#f1f8e9', // Light green background
    textColor: '#689f38',
    logoColor: '#8bc34a',
    chartColors: ['#8bc34a', '#689f38', '#c5e1a5', '#dcedc8', '#f1f8e9'],
    gradient: 'linear-gradient(135deg, #8bc34a 0%, #689f38 100%)',
    boxShadow: '0 4px 6px rgba(139, 195, 74, 0.1)'
  }
};

// CSS helper function to generate organization-specific styles
export const getOrganizationStyles = (organizationType: string) => {
  const branding = ORGANIZATION_BRANDING[organizationType] || ORGANIZATION_BRANDING['national-bank'];
  
  return `
    --org-primary: ${branding.primaryColor};
    --org-secondary: ${branding.secondaryColor};
    --org-accent: ${branding.accentColor};
    --org-background: ${branding.backgroundColor};
    --org-text: ${branding.textColor};
    --org-logo: ${branding.logoColor};
  `;
};

// Tailwind CSS class generator for organization-specific styling
export const getOrganizationClasses = (organizationType: string, element: string) => {
  const branding = ORGANIZATION_BRANDING[organizationType] || ORGANIZATION_BRANDING['national-bank'];
  
  const classMap: Record<string, string> = {
    'header': `bg-[${branding.primaryColor}] text-white`,
    'card': `border-[${branding.primaryColor}]`,
    'button-primary': `bg-[${branding.primaryColor}] hover:bg-[${branding.secondaryColor}]`,
    'button-outline': `border-[${branding.primaryColor}] text-[${branding.primaryColor}] hover:bg-[${branding.primaryColor}] hover:text-white`,
    'badge': `bg-[${branding.primaryColor}] text-white`,
    'avatar': `bg-[${branding.primaryColor}]`,
    'chart-primary': branding.chartColors[0],
    'chart-secondary': branding.chartColors[1],
    'chart-accent': branding.chartColors[2]
  };
  
  return classMap[element] || '';
};

export default ORGANIZATION_BRANDING;