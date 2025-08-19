import { useState, useCallback } from 'react';
import {
  contract,
  type DocumentMetadata,
  type ExportRequest,
} from '../lib/fabric';
import { uploadToIPFS } from '../services/ipfsService';

export type ExportDocument = {
  file: File;
  type: string;
  metadata: Omit<DocumentMetadata, 'uploadedAt'>;
};

type UseExportReturn = {
  submitExport: (
    documents: ExportDocument[],
    exporterId: string
  ) => Promise<{ txHash: string; exportId: string }>;
  verifyDocument: (exportId: string, docType: string) => Promise<boolean>;
  getDocument: (exportId: string, docType: string) => Promise<DocumentMetadata>;
  getExportRequest: (exportId: string) => Promise<ExportRequest>;
  status: 'idle' | 'uploading' | 'submitting' | 'success' | 'error';
  error: Error | null;
  progress: {
    current: number;
    total: number;
    message: string;
  } | null;
};

export const useExport = (): UseExportReturn => {
  const [status, setStatus] = useState<UseExportReturn['status']>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<UseExportReturn['progress']>(null);

  // Upload documents to IPFS and prepare metadata
  const uploadDocuments = useCallback(async (documents: ExportDocument[]) => {
    setStatus('uploading');
    setError(null);

    const results: Record<string, DocumentMetadata> = {};

    try {
      for (let i = 0; i < documents.length; i++) {
        const { file, type, metadata } = documents[i];

        setProgress({
          current: i + 1,
          total: documents.length,
          message: `Uploading ${type} document...`,
        });

        // Upload to IPFS
        const { cid, url, iv, key } = await uploadToIPFS(file, {
          encrypt: metadata.encrypted,
          onProgress: (progress) => {
            setProgress((prev) => ({
              ...prev!,
              message: `Uploading ${type} document (${Math.round(progress * 100)}%)...`,
            }));
          },
        });

        // Store document metadata
        results[type] = {
          ...metadata,
          ipfsCid: cid,
          ipfsUrl: url,
          iv: iv || '',
          encrypted: metadata.encrypted,
          uploadedAt: Date.now(),
          contentType: file.type,
          size: file.size,
        };
      }

      setProgress(null);
      return results;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to upload documents to IPFS');
      setStatus('error');
      setError(error);
      throw error;
    }
  }, []);

  // Submit export with document metadata
  const submitExport = useCallback(
    async (documents: ExportDocument[], exporterId: string) => {
      try {
        // First upload all documents to IPFS
        const documentsMetadata = await uploadDocuments(documents);

        setStatus('submitting');
        setProgress({
          current: 1,
          total: 1,
          message: 'Submitting to blockchain...',
        });

        // Generate export ID and timestamp
        const exportId = `EXP-${Date.now()}`;
        const timestamp = Date.now();

        // Prepare the export request
        const exportRequest: Omit<ExportRequest, 'status'> = {
          exportId,
          documents: documentsMetadata,
          exporter: exporterId,
          timestamp,
        };

        // Submit to blockchain using the contract
        const txHash = await contract.submitExport(exportRequest);

        setStatus('success');
        setProgress(null);

        return { txHash, exportId };
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to submit export');
        setStatus('error');
        setError(error);
        throw error;
      }
    },
    [uploadDocuments]
  );

  // Verify document on the blockchain
  const verifyDocument = useCallback(
    async (exportId: string, docType: string) => {
      try {
        return await contract.verifyDocument(exportId, docType);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to verify document');
        setError(error);
        throw error;
      }
    },
    []
  );

  // Get document metadata
  const getDocument = useCallback(async (exportId: string, docType: string) => {
    try {
      return await contract.getDocument(exportId, docType);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to get document');
      setError(error);
      throw error;
    }
  }, []);

  // Get export request
  const getExportRequest = useCallback(async (exportId: string) => {
    try {
      return await contract.getExportRequest(exportId);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to get export request');
      setError(error);
      throw error;
    }
  }, []);

  return {
    submitExport,
    verifyDocument,
    getDocument,
    getExportRequest,
    status,
    error,
    progress,
  };
};
