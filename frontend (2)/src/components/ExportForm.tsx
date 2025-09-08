import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useExport } from '../hooks/useExport';
import { useExportApprovals } from '../hooks/useExportApprovals';
import type { ExportDocument } from '../hooks/useExport';
import { ExportStatus } from './ExportStatus';
import type { DocumentType, DocumentState } from './DocumentInput';
import { Button } from './ui/StandardComponents';
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

const ExporterDetailsTab = lazy(() => import('./ExporterDetailsTab'));
const TradeDetailsTab = lazy(() => import('./TradeDetailsTab'));
const DocumentsTab = lazy(() => import('./DocumentsTab'));

type DocumentsState = Record<DocumentType, DocumentState>;

type ExporterDetails = {
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
};

type TradeDetails = {
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
};

export default function ExportForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exportId } = useParams<{ exportId?: string }>();
  const [activeTab, setActiveTab] = useState<
    'exporter' | 'trade' | 'documents'
  >('exporter');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['coffee-exporters'];

  const [exporterDetails, setExporterDetails] = useState<ExporterDetails>({
    companyName: '',
    registrationNumber: '',
    taxId: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const [tradeDetails, setTradeDetails] = useState<TradeDetails>({
    productName: '',
    productDescription: '',
    quantity: 0,
    unit: 'kg',
    unitPrice: 0,
    totalValue: 0,
    currency: 'USD',
    countryOfOrigin: '',
    destinationCountry: '',
    incoterms: 'FOB',
    shippingDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    paymentTerms: '30 days',
    paymentMethod: 'Bank Transfer',
    specialInstructions: '',
  });

  const [documents, setDocuments] = useState<DocumentsState>({
    license: {
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      error: null,
      loading: false,
      name: undefined,
      size: undefined,
      type: undefined,
    },
    invoice: {
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      error: null,
      loading: false,
      name: undefined,
      size: undefined,
      type: undefined,
    },
    qualityCert: {
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      error: null,
      loading: false,
      name: undefined,
      size: undefined,
      type: undefined,
    },
    other: {
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      error: null,
      loading: false,
      name: undefined,
      size: undefined,
      type: undefined,
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [submittedExport, setSubmittedExport] = useState<{
    exportId: string;
    txHash: string;
    documents: Record<DocumentType, { name: string; hash: string }>;
  } | null>(null);

  const { submitExport, getExportRequest, status } = useExport();

  // Check if we're in edit mode
  useEffect(() => {
    if (exportId) {
      setIsEditMode(true);
      loadExistingExport(exportId);
    }
  }, [exportId]);

  // Handle tab navigation via query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      // Map the query parameter to the appropriate tab
      switch (tabParam) {
        case 'new-export':
          setActiveTab('exporter');
          break;
        case 'manage':
          // For manage, we might want to show a different view, but for now we'll default to exporter
          setActiveTab('exporter');
          break;
        default:
          // Default to exporter tab if invalid parameter
          setActiveTab('exporter');
      }
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (tab: 'exporter' | 'trade' | 'documents') => {
    setActiveTab(tab);
    
    // Update the URL to reflect the current tab
    const searchParams = new URLSearchParams(location.search);
    
    // Map the tab to the appropriate query parameter
    switch (tab) {
      case 'exporter':
        searchParams.set('tab', 'new-export');
        break;
      case 'trade':
        searchParams.set('tab', 'trade-details');
        break;
      case 'documents':
        searchParams.set('tab', 'documents');
        break;
    }
    
    navigate({
      search: searchParams.toString(),
    }, { replace: true });
  };

  // Load existing export data for editing
  const loadExistingExport = async (id: string) => {
    setLoadingExport(true);
    try {
      const exportRequest = await getExportRequest(id);
      // TODO: Populate form fields with existing data
      // This would require mapping the exportRequest data to the form state
      console.log('Loaded export data:', exportRequest);
    } catch (error) {
      console.error('Failed to load export data:', error);
    } finally {
      setLoadingExport(false);
    }
  };

  // Handle form field changes
  const handleExporterDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setExporterDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTradeDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setTradeDetails((prev) => {
      const newValue =
        type === 'number' ? (value === '' ? 0 : Number(value)) : value;
      const updatedDetails = {
        ...prev,
        [name]: newValue,
      };

      // Calculate total value if quantity or unit price changes
      if (name === 'quantity' || name === 'unitPrice') {
        updatedDetails.totalValue =
          updatedDetails.quantity * updatedDetails.unitPrice;
      }

      return updatedDetails;
    });
  };

  // Form validation
  const isExporterDetailsValid = () => {
    return (
      exporterDetails.companyName &&
      exporterDetails.registrationNumber &&
      exporterDetails.contactPerson &&
      exporterDetails.email &&
      exporterDetails.phone &&
      exporterDetails.address &&
      exporterDetails.city &&
      exporterDetails.country &&
      exporterDetails.postalCode
    );
  };

  const isTradeDetailsValid = () => {
    return (
      tradeDetails.productName &&
      tradeDetails.quantity > 0 &&
      tradeDetails.unitPrice > 0 &&
      tradeDetails.countryOfOrigin &&
      tradeDetails.destinationCountry &&
      tradeDetails.shippingDate &&
      tradeDetails.expectedDeliveryDate
    );
  };

  const nextTab = () => {
    if (activeTab === 'exporter' && isExporterDetailsValid()) {
      handleTabChange('trade');
    } else if (activeTab === 'trade' && isTradeDetailsValid()) {
      handleTabChange('documents');
    }
  };

  const prevTab = () => {
    if (activeTab === 'trade') {
      handleTabChange('exporter');
    } else if (activeTab === 'documents') {
      handleTabChange('trade');
    }
  };

  const handleDocumentChange = (
    type: DocumentType,
    documentData: DocumentState
  ) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...documentData,
        loading: false,
      },
    }));
  };

  const handleDocumentError = useCallback(
    (type: DocumentType, error: string) => {
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          file: null,
          cid: null,
          url: null,
          iv: null,
          key: null,
          error,
        },
      }));
    },
    []
  );

  const { approvals: orgApprovals, loading: approvalsLoading } =
    useExportApprovals(submittedExport?.exportId || null);

  const isFormValid = Object.values(documents).every((doc) => doc.cid !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isFormValid) {
      setFormError('Please complete all required fields');
      return;
    }

    try {
      // Prepare documents for submission
      const exportDocuments: ExportDocument[] = Object.entries(documents)
        .filter(([, doc]) => doc.file)
        .map(([type, doc]) => ({
          file: doc.file!,
          type: type,
          metadata: {
            hash: '', // This will be calculated by the upload function
            ipfsCid: doc.cid!,
            ipfsUrl: doc.url!,
            iv: doc.iv!,
            encrypted: !!doc.key,
            contentType: doc.file!.type,
            size: doc.file!.size,
          },
        }));

      const result = await submitExport(
        exportDocuments,
        exporterDetails.registrationNumber
      );
      console.log('Export submitted successfully:', result);

      // Store the submitted export details
      setSubmittedExport({
        exportId: result.exportId,
        txHash: result.txHash,
        documents: Object.entries(documents).reduce<
          Record<string, { name: string; hash: string }>
        >(
          (acc, [type, doc]) => {
            if (doc.cid) {
              acc[type as DocumentType] = {
                name: doc.name || getDocumentLabel(type as DocumentType),
                hash: doc.cid,
              };
            }
            return acc;
          },
          {} as Record<DocumentType, { name: string; hash: string }>
        ),
      });
    } catch (err) {
      console.error('Error submitting export:', err);
      setFormError(
        err instanceof Error ? err.message : 'Failed to submit export'
      );
    }
  };

  const handleReset = () => {
    setDocuments({
      license: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      invoice: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      qualityCert: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      other: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
    });
    setFormError(null);
  };

  const handleNewExport = () => {
    setSubmittedExport(null);
    setFormError(null);
    setDocuments({
      license: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      invoice: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      qualityCert: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
      other: {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        error: null,
        loading: false,
        name: undefined,
        size: undefined,
        type: undefined,
      },
    });
  };

  const getDocumentLabel = (type: DocumentType) =>
    ({
      license: 'Export License',
      invoice: 'Commercial Invoice',
      qualityCert: 'Quality Certificate',
      other: 'Other Documents',
    })[type] || type;

  if (submittedExport) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-800">
          <p className="font-medium">Export submitted successfully!</p>
          <p className="text-sm mt-1">Transaction: {submittedExport.txHash}</p>
          {submittedExport?.txHash && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Transaction:{' '}
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {submittedExport.txHash}
              </span>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(submittedExport.txHash || '')
                }
                variant="ghost"
                size="sm"
                className="ml-2"
              >
                📋
              </Button>
            </div>
          )}
        </div>

        <ExportStatus
          exportId={submittedExport.exportId}
          txHash={submittedExport.txHash}
          documents={submittedExport.documents}
          approvals={orgApprovals}
          isLoading={approvalsLoading}
        />

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleNewExport}
            variant="primary"
            size="md"
            className="hover:bg-[#5A189A]"
            style={{ backgroundColor: orgBranding.primaryColor }}
          >
            Submit Another Export
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold" style={{ color: orgBranding.primaryColor }}>
          {isEditMode ? "Edit Export Documentation" : "Export Documentation"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode 
            ? "Edit the information for your export process" 
            : "Complete all required information for your export process"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {(['exporter', 'trade', 'documents'] as const).map((tab, index) => {
            const isEnabled =
              tab === 'exporter' ||
              (tab === 'trade' && isExporterDetailsValid()) ||
              (tab === 'documents' &&
                isExporterDetailsValid() &&
                isTradeDetailsValid());

            return (
              <div key={tab} className="flex flex-col items-center flex-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEnabled) {
                      handleTabChange(tab);
                    }
                  }}
                  disabled={!isEnabled}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: activeTab === tab 
                      ? orgBranding.primaryColor 
                      : isEnabled 
                        ? `${orgBranding.primaryColor}20` 
                        : undefined, 
                    color: activeTab === tab 
                      ? 'white' 
                      : isEnabled 
                        ? orgBranding.primaryColor 
                        : undefined 
                  }}
                >
                  {index + 1}
                </Button>
                <span
                  className="mt-2 text-sm font-medium"
                  style={{ 
                    color: activeTab === tab 
                      ? orgBranding.primaryColor 
                      : undefined 
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: orgBranding.primaryColor,
              width:
                activeTab === 'exporter'
                  ? '16.66%'
                  : activeTab === 'trade'
                    ? '50%'
                    : '83.33%',
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
            <p className="text-red-700 dark:text-red-300">{formError}</p>
          </div>
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: orgBranding.primaryColor }}></div>
            <span className="ml-4 text-muted-foreground">Loading form components...</span>
          </div>
        }>
          {activeTab === 'exporter' && (
            <ExporterDetailsTab
              exporterDetails={exporterDetails}
              handleExporterDetailsChange={handleExporterDetailsChange}
            />
          )}

          {activeTab === 'trade' && (
            <TradeDetailsTab
              tradeDetails={tradeDetails}
              handleTradeDetailsChange={handleTradeDetailsChange}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsTab
              documents={documents}
              handleDocumentChange={handleDocumentChange}
              handleDocumentError={handleDocumentError}
              getDocumentLabel={getDocumentLabel}
            />
          )}
        </Suspense>

        <div className="flex justify-between mt-8">
          <div>
            {activeTab === 'trade' || activeTab === 'documents' ? (
              <Button
                variant="outline"
                onClick={prevTab}
                className="hover:text-white" style={{ borderColor: orgBranding.primaryColor, color: orgBranding.primaryColor }}
              >
                Previous
              </Button>
            ) : null}
          </div>

          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="hover:text-white" style={{ borderColor: orgBranding.accentColor, color: orgBranding.accentColor }}
            >
              Reset
            </Button>

            {activeTab === 'exporter' || activeTab === 'trade' ? (
              <Button
                variant="primary"
                onClick={nextTab}
                disabled={
                  (activeTab === 'exporter' && !isExporterDetailsValid()) ||
                  (activeTab === 'trade' && !isTradeDetailsValid())
                }
                className="hover:bg-[#5A189A]"
                style={{ backgroundColor: orgBranding.primaryColor }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                disabled={!isFormValid || status === 'submitting' || loadingExport}
                loading={status === 'submitting' || loadingExport}
                className="hover:bg-[#5A189A]"
                style={{ backgroundColor: orgBranding.primaryColor }}
              >
                {loadingExport 
                  ? "Loading..." 
                  : status === 'submitting' 
                    ? 'Submitting...' 
                    : isEditMode 
                      ? 'Update Export' 
                      : 'Submit Export'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
