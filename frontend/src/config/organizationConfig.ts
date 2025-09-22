import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Archive 
} from 'lucide-react';

export interface OrganizationConfig {
  name: string;
  role: string;
  icon: React.ComponentType<any>;
  color: string;
  documentTypes: string[];
}

export const ORGANIZATION_CONFIGS: Record<string, OrganizationConfig> = {
  'national-bank': {
    name: 'National Bank',
    role: 'Export License Validator',
    icon: Shield,
    color: 'bg-purple-600',
    documentTypes: ['Export License']
  },
  'exporter-bank': {
    name: 'Exporter Bank',
    role: 'Commercial Invoice Validator',
    icon: FileText,
    color: 'bg-yellow-500',
    documentTypes: ['Commercial Invoice']
  },
  'coffee-authority': {
    name: 'Coffee Quality Authority',
    role: 'Quality Certificate Validator',
    icon: CheckCircle,
    color: 'bg-yellow-600',
    documentTypes: ['Quality Certificate']
  },
  'customs': {
    name: 'Customs Authority',
    role: 'Shipping Documents Validator',
    icon: Archive,
    color: 'bg-purple-500',
    documentTypes: ['Shipping Documents']
  }
};

export const getOrganizationConfig = (organizationType: string): OrganizationConfig => {
  return ORGANIZATION_CONFIGS[organizationType] || ORGANIZATION_CONFIGS['national-bank'];
};