export type ExportStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'VALIDATING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAYMENT_RELEASED';

export interface ExportSummary {
  id: string;
  exportId: string;
  productType: string;
  quantity: number;
  totalValue: number;
  currency: string;
  destination: string;
  status: ExportStatus;
  submittedAt?: number;
  validationProgress: number;
}

export interface ExportStats {
  totalExports: number;
  activeExports: number;
  pendingValidation: number;
  approvedExports: number;
  totalValue: number;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  action: string;
  status: 'success' | 'pending' | 'failed';
  performedBy: string;
  details?: string;
}

export interface DocumentState {
  file: File | null;
  cid: string | null;
  url: string | null;
  iv: string | null;
  key: string | null;
  loading: boolean;
  error: string | null;
  name?: string;
  size?: number;
  type?: string;
}

export type DocumentType = 'license' | 'invoice' | 'qualityCert' | 'other';

export interface ExportDocuments {
  [key: string]: DocumentState;
}

export interface ExporterDetails {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface TradeDetails {
  productName: string;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  currency: string;
  countryOfOrigin: string;
  destinationCountry: string;
  incoterms: string;
  shippingDate: string;
  expectedDeliveryDate: string;
  paymentTerms: string;
  paymentMethod: string;
  specialInstructions?: string;
}

export interface ExportRequest {
  id: string;
  exporterId: string;
  status: ExportStatus;
  submittedAt?: number;
  exporterDetails: ExporterDetails;
  tradeDetails: TradeDetails;
  documents: ExportDocuments;
  validationSummary: {
    totalValidations: number;
    completedValidations: number;
  };
}
