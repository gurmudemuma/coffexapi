import { useAuth } from '../store';

// Types for export data
export type DocumentMetadata = {
  hash: string;
  ipfsCid: string;
  ipfsUrl: string;
  iv: string;
  encrypted: boolean;
  uploadedAt: number;
  contentType: string;
  size: number;
};

export type ValidationSummary = {
  totalValidations: number;
  completedValidations: number;
  passedValidations: number;
  failedValidations: number;
};

export type TradeDetails = {
  productType: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  currency: string;
  destination: string;
  contractNumber: string;
};

export type ExportRequest = {
  id: string;
  exportId: string;
  exporter: string;
  exporterId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'PAYMENT_RELEASED';
  submittedAt?: number;
  tradeDetails: TradeDetails;
  documents: Record<string, DocumentMetadata>;
  validationSummary: ValidationSummary;
  timestamp: number;
};

// Contract interface
export class FabricContract {
  private apiGatewayUrl: string;

  constructor() {
    // Get API Gateway URL from environment variables
    this.apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';
  }

  // Submit a new export request to the blockchain
  async submitExport(exportRequest: Omit<ExportRequest, 'status'>): Promise<string> {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/api/exports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit export: ${response.statusText}`);
      }

      const result = await response.json();
      return result.txHash;
    } catch (error) {
      console.error('Error submitting export to blockchain:', error);
      throw error;
    }
  }

  // Get all export requests (for filtering on client side)
  async getAllExports(): Promise<Record<string, ExportRequest>> {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/api/exports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exports: ${response.statusText}`);
      }

      const exports = await response.json();
      return exports;
    } catch (error) {
      console.error('Error fetching all exports from blockchain:', error);
      throw error;
    }
  }

  // Get all export requests for a specific exporter
  async getExportsByExporter(exporterId: string): Promise<Record<string, ExportRequest>> {
    try {
      // First get all exports
      const allExports = await this.getAllExports();
      
      // Then filter by exporterId
      const filteredExports: Record<string, ExportRequest> = {};
      Object.keys(allExports).forEach(key => {
        if (allExports[key].exporterId === exporterId) {
          filteredExports[key] = allExports[key];
        }
      });
      
      return filteredExports;
    } catch (error) {
      console.error('Error filtering exports by exporter:', error);
      throw error;
    }
  }

  // Get all export requests for a specific organization
  async getExportsByOrganization(organization: string): Promise<Record<string, ExportRequest>> {
    try {
      // First get all exports
      const allExports = await this.getAllExports();
      
      // Then filter by organization
      const filteredExports: Record<string, ExportRequest> = {};
      Object.keys(allExports).forEach(key => {
        if (allExports[key].exporter === organization) {
          filteredExports[key] = allExports[key];
        }
      });
      
      return filteredExports;
    } catch (error) {
      console.error('Error filtering exports by organization:', error);
      throw error;
    }
  }

  // Get a specific export request by ID
  async getExportRequest(exportId: string): Promise<ExportRequest> {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/api/exports/${exportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch export: ${response.statusText}`);
      }

      const exportRequest = await response.json();
      return exportRequest;
    } catch (error) {
      console.error('Error fetching export from blockchain:', error);
      throw error;
    }
  }

  // Verify a document's integrity
  async verifyDocument(exportId: string, docType: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/api/exports/${exportId}/documents/${docType}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to verify document: ${response.statusText}`);
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error verifying document on blockchain:', error);
      throw error;
    }
  }

  // Get document metadata
  async getDocument(exportId: string, docType: string): Promise<DocumentMetadata> {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/api/exports/${exportId}/documents/${docType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const document = await response.json();
      return document;
    } catch (error) {
      console.error('Error fetching document from blockchain:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const contract = new FabricContract();