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
    name: 'The Mint',
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#800080', // Purple
    accentColor: '#000000', // Black
    backgroundColor: '#f8f9fa', // Light gray
    textColor: '#000000',
    logoColor: '#FFD700',
    chartColors: ['#FFD700', '#800080', '#000000', '#E6E6FA', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #FFD700 0%, #800080 100%)',
    boxShadow: '0 4px 6px rgba(128, 0, 128, 0.1)'
  },
  'customs': {
    name: 'Clearance House',
    primaryColor: '#0000FF', // Blue
    secondaryColor: '#ADD8E6', // Light Blue
    accentColor: '#FFFFFF', // White
    backgroundColor: '#f1f8e9', // Light green background
    textColor: '#0000FF',
    logoColor: '#0000FF',
    chartColors: ['#0000FF', '#ADD8E6', '#FFFFFF', '#E6E6FA', '#F0F8FF'],
    gradient: 'linear-gradient(135deg, #0000FF 0%, #ADD8E6 100%)',
    boxShadow: '0 4px 6px rgba(0, 0, 255, 0.1)'
  },
  'quality-authority': {
    name: 'Cup of Quality',
    primaryColor: '#A52A2A', // Brown
    secondaryColor: '#D2B48C', // Tan
    accentColor: '#F5F5DC', // Beige
    backgroundColor: '#fce4ec', // Light pink background
    textColor: '#A52A2A',
    logoColor: '#A52A2A',
    chartColors: ['#A52A2A', '#D2B48C', '#F5F5DC', '#FAEBD7', '#FFFAF0'],
    gradient: 'linear-gradient(135deg, #A52A2A 0%, #D2B48C 100%)',
    boxShadow: '0 4px 6px rgba(165, 42, 42, 0.1)'
  },
  'exporter-bank': {
    name: 'The Vault',
    primaryColor: '#FFD700', // Gold
    secondaryColor: '#800080', // Purple
    accentColor: '#000000', // Black
    backgroundColor: '#fff3e0', // Light orange background
    textColor: '#000000',
    logoColor: '#FFD700',
    chartColors: ['#FFD700', '#800080', '#000000', '#E6E6FA', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #FFD700 0%, #800080 100%)',
    boxShadow: '0 4px 6px rgba(128, 0, 128, 0.1)'
  },
  'coffee-exporters': {
    name: 'GreenBean Exporters',
    primaryColor: '#008000', // Green
    secondaryColor: '#90EE90', // Light Green
    accentColor: '#D2B48C', // Tan
    backgroundColor: '#f1f8e9', // Light green background
    textColor: '#008000',
    logoColor: '#008000',
    chartColors: ['#008000', '#90EE90', '#D2B48C', '#F0E68C', '#F5DEB3'],
    gradient: 'linear-gradient(135deg, #008000 0%, #90EE90 100%)',
    boxShadow: '0 4px 6px rgba(0, 128, 0, 0.1)'
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