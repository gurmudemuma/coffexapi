import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useExport } from '../hooks/useExport';
import { useExportApprovals } from '../hooks/useExportApprovals';
import type { ExportDocument } from '../hooks/useExport';
import { ExportStatus } from './ExportStatus';
import type { DocumentType, DocumentState } from './DocumentInput';

const ExporterDetailsTab = lazy(() => import('./ExporterDetailsTab'));
const TradeDetailsTab = lazy(() => import('./TradeDetailsTab'));
const DocumentsTab = lazy(() => import('./DocumentsTab'));

// Reuse DocumentState from DocumentInputNew
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
  const [activeTab, setActiveTab] = useState<
    'exporter' | 'trade' | 'documents'
  >('exporter');

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

  const { submitExport, status } = useExport();

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
      setActiveTab('trade');
    } else if (activeTab === 'trade' && isTradeDetailsValid()) {
      setActiveTab('documents');
    }
  };

  const prevTab = () => {
    if (activeTab === 'trade') {
      setActiveTab('exporter');
    } else if (activeTab === 'documents') {
      setActiveTab('trade');
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
            hash: doc.cid || '', // Use IPFS CID as hash
            ipfsCid: doc.cid!,
            ipfsUrl: doc.url!,
            iv: doc.iv!,
            key: doc.key!, // Include encryption key for document viewing
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

      // Dispatch custom event for portal integration
      const exportSuccessEvent = new CustomEvent('exportSubmissionSuccess', {
        detail: {
          exportId: result.exportId,
          txHash: result.txHash
        }
      });
      window.dispatchEvent(exportSuccessEvent);
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
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
          <p className="font-medium">Export submitted successfully!</p>
          <p className="text-sm mt-1">Transaction: {submittedExport.txHash}</p>
          {submittedExport?.txHash && (
            <div className="mt-4 text-sm text-purple-600">
              Transaction:{' '}
              <span className="font-mono text-xs bg-purple-50 px-2 py-1 rounded border border-purple-200">
                {submittedExport.txHash}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(submittedExport.txHash || '')
                }
                className="ml-2 text-purple-600 hover:text-purple-800"
                title="Copy to clipboard"
              >
                📋
              </button>
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

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => {
              // Check if we're in the portal context by dispatching an event
              const portalNavigateEvent = new CustomEvent('portalNavigateToTracking');
              window.dispatchEvent(portalNavigateEvent);
              
              // Fallback to direct navigation if not in portal
              setTimeout(() => {
                if (window.location.pathname !== '/export') {
                  window.location.href = '/dashboard';
                }
              }, 100);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={handleNewExport}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            Submit Another Export
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow border border-purple-200">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold text-black">
          Export Documentation
        </h1>
        <p className="text-purple-600">
          Complete all required information for your export process
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
                <button
                  type="button"
                  onClick={() => {
                    if (isEnabled) {
                      setActiveTab(tab);
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : isEnabled
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {index + 1}
                </button>
                <span
                  className={`mt-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-black'
                      : 'text-purple-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-purple-200 rounded-full">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{
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
          <div className="p-4 bg-red-50 border-l-4 border-red-500 border border-red-200 rounded-lg">
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-purple-600">Loading form components...</span>
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
              <button
                type="button"
                onClick={prevTab}
                className="px-4 py-2 border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50"
              >
                Previous
              </button>
            ) : null}
          </div>

          <div className="space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50"
            >
              Reset
            </button>

            {activeTab === 'exporter' || activeTab === 'trade' ? (
              <button
                type="button"
                onClick={nextTab}
                disabled={
                  (activeTab === 'exporter' && !isExporterDetailsValid()) ||
                  (activeTab === 'trade' && !isTradeDetailsValid())
                }
                className={`px-4 py-2 rounded-md text-white ${
                  (activeTab === 'exporter' && isExporterDetailsValid()) ||
                  (activeTab === 'trade' && isTradeDetailsValid())
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isFormValid || status === 'submitting'}
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid && status !== 'submitting'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Export'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
