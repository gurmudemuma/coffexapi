import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useExport } from '../hooks/useExport';
import { useExportApprovals } from '../hooks/useExportApprovals';
import type { ExportDocument } from '../hooks/useExport';
import { ExportStatus } from './ExportStatus';
import type { DocumentType, DocumentState } from './DocumentInputNew';

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
              <button
                onClick={() =>
                  navigator.clipboard.writeText(submittedExport.txHash || '')
                }
                className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
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

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNewExport}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Another Export
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Export Documentation
        </h1>
        <p className="text-muted-foreground">
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
                      ? 'bg-primary text-white'
                      : isEnabled
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {index + 1}
                </button>
                <span
                  className={`mt-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
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
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
            <p className="text-red-700 dark:text-red-300">{formError}</p>
          </div>
        )}

        <Suspense fallback={<div>Loading...</div>}>
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
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            ) : null}
          </div>

          <div className="space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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
                    ? 'bg-primary hover:bg-primary/90'
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
                    ? 'bg-primary hover:bg-primary/90'
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
