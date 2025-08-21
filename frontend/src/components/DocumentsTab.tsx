import React from 'react';
import { DocumentInput } from './DocumentInput';
import type { DocumentType, DocumentState } from './DocumentInput';

// Define types for props
interface DocumentsState {
  [key: string]: DocumentState;
}

interface DocumentsTabProps {
  documents: DocumentsState;
  handleDocumentChange: (
    type: DocumentType,
    documentData: DocumentState
  ) => void;
  handleDocumentError: (type: DocumentType, error: string) => void;
  getDocumentLabel: (type: DocumentType) => string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  handleDocumentChange,
  handleDocumentError,
  getDocumentLabel,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Required Documents</h2>
      <p className="text-muted-foreground">
        Upload all required documents for your export. All documents are
        required.
      </p>

      <div className="space-y-6 bg-muted/50 p-6 rounded-lg border">
        {(Object.entries(documents) as [DocumentType, DocumentState][]).map(
          ([type, doc]) => (
            <div
              key={type}
              className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    doc.file
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300'
                  }`}
                >
                  {doc.file
                    ? '✓'
                    : type === 'license'
                      ? '1'
                      : type === 'invoice'
                        ? '2'
                        : type === 'qualityCert'
                          ? '3'
                          : '4'}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {getDocumentLabel(type)}
                </h3>
              </div>

              <div className="pl-11">
                <DocumentInput
                  type={type}
                  onChange={(newState) => handleDocumentChange(type, newState)}
                  onError={(error) => handleDocumentError(type, error)}
                  accept=".pdf,.doc,.docx"
                  label={getDocumentLabel(type)}
                  description={`Upload ${getDocumentLabel(type).toLowerCase()}`}
                  required={true}
                  value={{
                    file: doc.file,
                    cid: doc.cid,
                    url: doc.url,
                    iv: doc.iv,
                    key: doc.key,
                    name: doc.name,
                    size: doc.size,
                    type: doc.type,
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
