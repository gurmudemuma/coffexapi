import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { contract } from '@/lib/fabric';
import { downloadFromIPFS } from '@/services/ipfsService';
import { format } from 'date-fns';
import {
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  File,
  FileImage,
  FileText as FileTextIcon,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

type VerificationStatus =
  | 'idle'
  | 'verifying'
  | 'verified'
  | 'error'
  | 'verification_failed';

interface DocumentMetadata {
  cid: string;
  url: string;
  iv: string;
  key: string;
  encrypted: boolean;
  contentType: string;
  size?: number;
  name?: string;
  originalName?: string;
  uploadedAt?: string;
  hash?: string;
}

interface VerificationResult {
  isValid: boolean;
  timestamp: string;
  verifiedBy: string;
  documentHash: string;
  blockHash: string;
  error?: string;
}

interface DocumentViewerProps {
  exportId: string;
  documentType: string;
  documentMetadata: DocumentMetadata;
  className?: string;
  onVerificationComplete?: (result: VerificationResult) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  exportId,
  documentType,
  documentMetadata,
  className,
  onVerificationComplete,
}) => {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>('idle');
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Verify document when component mounts
  useEffect(() => {
    verifyDocument();
  }, [documentMetadata]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const verifyDocument = async () => {
    if (!documentMetadata?.cid || !documentMetadata?.hash) return;

    setVerificationStatus('verifying');
    setVerificationError(null);

    try {
      const toastId = toast.loading('Verifying document...');

      // Mock verification - replace with actual blockchain verification
      const result: VerificationResult = {
        isValid: true,
        timestamp: new Date().toISOString(),
        verifiedBy: 'Blockchain',
        documentHash: documentMetadata.hash,
        blockHash:
          '0x' +
          Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(''),
      };

      setVerificationResult(result);
      setVerificationStatus('verified');

      toast.success('Document verified successfully', { id: toastId });
      onVerificationComplete?.(result);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationError(
        error instanceof Error ? error.message : 'Verification failed'
      );
      toast.error('Failed to verify document');
    }
  };

  const handleDownload = async () => {
    if (!documentMetadata?.cid) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const toastId = toast.loading('Preparing download...');

      const progressCallback = (progress: number) => {
        setDownloadProgress(progress);
      };

      const blob = await downloadFromIPFS(documentMetadata.cid, {
        onProgress: progressCallback,
        ...(documentMetadata.encrypted && {
          iv: documentMetadata.iv,
          key: documentMetadata.key,
        }),
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        documentMetadata.originalName ||
        `document-${documentMetadata.cid.substring(0, 8)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download started', { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handlePreview = async () => {
    if (!documentMetadata?.cid) return;

    if (previewUrl) {
      window.open(previewUrl, '_blank');
      return;
    }

    setIsPreviewLoading(true);

    try {
      const toastId = toast.loading('Loading preview...');

      const blob = await downloadFromIPFS(
        documentMetadata.cid,
        documentMetadata.encrypted
          ? {
              iv: documentMetadata.iv,
              key: documentMetadata.key,
            }
          : undefined
      );

      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Open in new tab
      const newWindow = window.open('', '_blank');
      if (newWindow && newWindow.document) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${documentMetadata.name || 'Document Preview'}</title>
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
                img, iframe { max-width: 100%; max-height: 90vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              </style>
            </head>
            <body>
              ${
                documentMetadata.contentType?.startsWith('image/')
                  ? `<img src="${url}" alt="${documentMetadata.name || 'Document'}" />`
                  : `<iframe src="${url}" width="100%" height="100%" style="border: none;"></iframe>`
              }
            </body>
          </html>
        `);
        newWindow.document.close();
      }

      toast.dismiss(toastId);
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to load preview');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (!type) return <File className="h-4 w-4" />;

    if (type.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    }

    switch (type) {
      case 'application/pdf':
        return <FileTextIcon className="h-4 w-4" />;
      case 'text/plain':
      case 'text/csv':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number = 0): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex items-center text-yellow-600">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Verifying...</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Verified</span>
          </div>
        );
      case 'verification_failed':
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-2" />
            <span>Verification Failed</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Shield className="h-4 w-4 mr-2" />
            <span>Not Verified</span>
          </div>
        );
    }
  };

  return (
    <div className={cn('border rounded-lg p-6 bg-white shadow-sm', className)}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            {getFileIcon(documentMetadata?.contentType || '')}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {documentMetadata?.originalName || 'Document'}
            </h3>
            <div className="text-sm text-gray-500 mt-1">
              {documentMetadata?.contentType || 'Unknown type'}
              {documentMetadata?.size &&
                ` • ${formatFileSize(documentMetadata.size)}`}
            </div>
            <div className="mt-2">{renderVerificationStatus()}</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Preview'
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>
        </div>
      </div>

      {isDownloading && (
        <div className="mt-4">
          <Progress value={downloadProgress} className="h-2" />
          <div className="text-xs text-right text-gray-500 mt-1">
            {Math.round(downloadProgress)}% downloaded
          </div>
        </div>
      )}

      {verificationResult && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">
            Verification Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium">
                {verificationResult.isValid ? 'Valid' : 'Invalid'}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Verified By</div>
              <div className="font-medium">{verificationResult.verifiedBy}</div>
            </div>
            <div>
              <div className="text-gray-500">Document Hash</div>
              <div className="font-mono text-xs truncate">
                {verificationResult.documentHash}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Block Hash</div>
              <div className="font-mono text-xs truncate">
                {verificationResult.blockHash}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Timestamp</div>
              <div className="font-medium">
                {verificationResult.timestamp
                  ? format(new Date(verificationResult.timestamp), 'PPpp')
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {verificationError && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{verificationError}</span>
          </div>
          <button
            onClick={verifyDocument}
            className="mt-2 text-sm text-red-700 hover:underline flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry Verification
          </button>
        </div>
      )}
    </div>
  );
};
