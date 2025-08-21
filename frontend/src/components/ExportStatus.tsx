import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DocumentViewer } from './DocumentViewer';
import type { DocumentType } from './DocumentInput';
import { cn } from '@/lib/utils';

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'VERIFIED';

type OrganizationApproval = {
  name: string;
  role: string;
  status: ApprovalStatus;
  timestamp?: string;
  comment?: string;
};

// Extended document type to include IPFS metadata
type DocumentWithMetadata = {
  name: string;
  hash: string;
  cid?: string;
  url?: string;
  iv?: string;
  key?: string;
  encrypted?: boolean;
  contentType?: string;
};

type TabValue = 'status' | 'documents';

type ExportStatusProps = {
  exportId: string;
  txHash: string;
  documents: Record<DocumentType, DocumentWithMetadata>;
  approvals: OrganizationApproval[];
  isLoading?: boolean;
};

export const ExportStatus: React.FC<ExportStatusProps> = ({
  exportId,
  txHash,
  documents,
  approvals,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>('status');
  const documentEntries = Object.entries(documents) as [
    DocumentType,
    DocumentWithMetadata,
  ][];

  const getStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'VERIFIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Loading export status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value as TabValue)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Export Request Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Export ID
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {exportId}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Transaction Hash
                </h3>
                <p className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                  {txHash}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">Approval Status</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {approvals.map((approval, index) => (
                <div
                  key={index}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-medium">{approval.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {approval.role}
                    </p>
                    {approval.comment && (
                      <p className="text-sm mt-1 text-muted-foreground">
                        Note: {approval.comment}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getStatusColor(approval.status)
                      )}
                    >
                      {approval.status}
                    </span>
                    {approval.timestamp && (
                      <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(approval.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Export Documents</h2>
            <div className="space-y-4">
              {documentEntries.map(([docType, doc]) => (
                <DocumentViewer
                  key={docType}
                  exportId={exportId}
                  documentType={docType}
                  documentMetadata={{
                    cid: doc.cid || '',
                    url: doc.url || `http://localhost:8080/ipfs/${doc.cid}`,
                    iv: doc.iv || '',
                    key: doc.key || '',
                    encrypted: !!doc.encrypted,
                    contentType: doc.contentType || 'application/octet-stream',
                  }}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
