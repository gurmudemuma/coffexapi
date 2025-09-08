// Organization Branding Configuration
// This file defines the visual identity for each organization in the Coffee Export Platform

export interface OrganizationBranding {
  name: string;
  fullName: string;
  subtitle: string;
  description: string;
  dashboardTitle: string;
  portalType: string;
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
  // Updated to use purple and yellow colors from the image
  'national-bank': {
    name: 'National Bank of Ethiopia',
    fullName: 'National Bank of Ethiopia',
    subtitle: 'Financial License Validation Portal',
    description: 'Secure validation and approval of export licenses and financial documentation for Ethiopian coffee exports',
    dashboardTitle: 'License Validation Dashboard',
    portalType: 'Banking Authority',
    primaryColor: '#7B2CBF', // Purple
    secondaryColor: '#EFB80B', // Yellow
    accentColor: '#5A189A', // Dark Purple
    backgroundColor: '#f8f9fa', // Light gray
    textColor: '#000000',
    logoColor: '#7B2CBF', // Purple
    chartColors: ['#7B2CBF', '#EFB80B', '#5A189A', '#F4CA16', '#9D4EDD'], // Purple and yellow palette
    gradient: 'linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)',
    boxShadow: '0 4px 6px rgba(123, 44, 191, 0.1)'
  },
  'customs': {
    name: 'Clearance House',
    fullName: 'Ethiopian Customs Authority',
    subtitle: 'Export Clearance & Documentation Portal',
    description: 'Comprehensive customs clearance, shipping documentation validation, and export compliance management',
    dashboardTitle: 'Customs Clearance Dashboard',
    portalType: 'Customs Authority',
    primaryColor: '#7B2CBF', // Purple
    secondaryColor: '#EFB80B', // Yellow
    accentColor: '#5A189A', // Dark Purple
    backgroundColor: '#f1f8e9', // Light green background
    textColor: '#000000',
    logoColor: '#7B2CBF', // Purple
    chartColors: ['#7B2CBF', '#EFB80B', '#5A189A', '#F4CA16', '#9D4EDD'], // Purple and yellow palette
    gradient: 'linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)',
    boxShadow: '0 4px 6px rgba(123, 44, 191, 0.1)'
  },
  'quality-authority': {
    name: 'Cup of Quality',
    fullName: 'Ethiopian Coffee Quality Authority',
    subtitle: 'Coffee Quality Certification Portal',
    description: 'Professional coffee quality assessment, certification, and grading services for export excellence',
    dashboardTitle: 'Quality Certification Dashboard',
    portalType: 'Quality Authority',
    primaryColor: '#7B2CBF', // Purple
    secondaryColor: '#EFB80B', // Yellow
    accentColor: '#5A189A', // Dark Purple
    backgroundColor: '#FEF6EE', // Light coffee cream background
    textColor: '#000000',
    logoColor: '#7B2CBF', // Purple
    chartColors: ['#7B2CBF', '#EFB80B', '#5A189A', '#F4CA16', '#9D4EDD'], // Purple and yellow palette
    gradient: 'linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)',
    boxShadow: '0 4px 6px rgba(123, 44, 191, 0.1)'
  },
  'exporter-bank': {
    name: 'The Vault',
    fullName: 'Commercial Bank of Ethiopia - Export Division',
    subtitle: 'Trade Finance & Payment Portal',
    description: 'Secure trade finance, payment processing, and foreign exchange services for coffee export transactions',
    dashboardTitle: 'Trade Finance Dashboard',
    portalType: 'Commercial Bank',
    primaryColor: '#7B2CBF', // Purple
    secondaryColor: '#EFB80B', // Yellow
    accentColor: '#5A189A', // Dark Purple
    backgroundColor: '#FEF6EE', // Light coffee cream background
    textColor: '#000000',
    logoColor: '#7B2CBF', // Purple
    chartColors: ['#7B2CBF', '#EFB80B', '#5A189A', '#F4CA16', '#9D4EDD'], // Purple and yellow palette
    gradient: 'linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)',
    boxShadow: '0 4px 6px rgba(123, 44, 191, 0.1)'
  },
  'coffee-exporters': {
    name: 'GreenBean Exporters',
    fullName: 'Ethiopian Coffee Exporters Association',
    subtitle: 'Export Management & Trading Portal',
    description: 'Complete coffee export management, documentation submission, and international trade coordination',
    dashboardTitle: 'Export Management Dashboard',
    portalType: 'Export Association',
    primaryColor: '#7B2CBF', // Purple
    secondaryColor: '#EFB80B', // Yellow
    accentColor: '#5A189A', // Dark Purple
    backgroundColor: '#FEF6EE', // Light coffee cream background
    textColor: '#000000',
    logoColor: '#7B2CBF', // Purple
    chartColors: ['#7B2CBF', '#EFB80B', '#5A189A', '#F4CA16', '#9D4EDD'], // Purple and yellow palette
    gradient: 'linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)',
    boxShadow: '0 4px 6px rgba(123, 44, 191, 0.1)'
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

// Organization name mapping for user organization to branding key
export const ORGANIZATION_MAPPING: Record<string, string> = {
  'National Bank of Ethiopia': 'national-bank',
  'Ethiopian Customs Authority': 'customs',
  'Customs Authority': 'customs',
  'Ethiopian Coffee Quality Authority': 'quality-authority',
  'Coffee Quality Authority': 'quality-authority',
  'Quality Authority': 'quality-authority',
  'Commercial Bank of Ethiopia': 'exporter-bank',
  'Exporter Bank': 'exporter-bank',
  'Ethiopian Coffee Exporters Association': 'coffee-exporters',
  'Coffee Exporters Association': 'coffee-exporters'
};

// Get organization branding by user organization name
export const getOrganizationBranding = (userOrganization: string): OrganizationBranding => {
  const brandingKey = ORGANIZATION_MAPPING[userOrganization];
  return ORGANIZATION_BRANDING[brandingKey] || ORGANIZATION_BRANDING['national-bank'];
};

// Get organization branding key from user organization name
export const getOrganizationKey = (userOrganization: string): string => {
  return ORGANIZATION_MAPPING[userOrganization] || 'national-bank';
};