import { useState, useCallback, useRef } from 'react';
import { contract, type DocumentMetadata, type ExportRequest } from '../lib/fabric';
import { uploadToIPFS } from '../services/ipfsService';
import { toast } from 'sonner';
import { isFeatureEnabled } from '@/utils/env';

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
  cancel: () => void;
  reset: () => void;
};

const MAX_RETRIES = 3;

export const useExport = (): UseExportReturn => {
  const [status, setStatus] = useState<UseExportReturn['status']>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<UseExportReturn['progress']>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadDocuments = useCallback(async (documents: ExportDocument[]) => {
    setStatus('uploading');
    setError(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const results: Record<string, DocumentMetadata> = {};

    const uploadWithRetry = async (
      document: ExportDocument,
      attempt = 1
    ): Promise<{ cid: string; url: string; iv: string; key: string }> => {
      try {
        return await uploadToIPFS(document.file, {
          encrypt: document.metadata.encrypted,
          signal: controller.signal,
          onProgress: (progress) => {
            setProgress(prev => ({
              ...prev!,
              message: `Uploading ${document.type} document (${Math.round(progress * 100)}%)...`,
            }));
          },
        });
      } catch (err) {
        if (attempt < MAX_RETRIES && !controller.signal.aborted) {
          toast.warning(`Retrying upload (${attempt}/${MAX_RETRIES})...`);
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
          return uploadWithRetry(document, attempt + 1);
        }
        throw err;
      }
    };

    try {
      for (let i = 0; i < documents.length; i++) {
        if (controller.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        const { file, type, metadata } = documents[i];
        setProgress({
          current: i + 1,
          total: documents.length,
          message: `Uploading ${type} document...`,
        });

        const { cid, url, iv } = await uploadWithRetry(documents[i]);

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
      if (!controller.signal.aborted) {
        const error = err instanceof Error ? err : new Error('Failed to upload documents to IPFS');
        setStatus('error');
        setError(error);
        toast.error(`Upload failed: ${error.message}`);
        throw error;
      }
      throw new Error('Upload cancelled');
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStatus('idle');
      setProgress(null);
      toast.info('Operation cancelled');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setProgress(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const submitExport = useCallback(
    async (documents: ExportDocument[], exporterId: string) => {
      if (!isFeatureEnabled('IPFS_UPLOAD')) {
        const error = new Error('IPFS uploads are currently disabled');
        setError(error);
        setStatus('error');
        throw error;
      }

      setStatus('uploading');
      setError(null);
      setProgress({ 
        current: 0, 
        total: documents.length, 
        message: 'Starting upload...' 
      });
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      try {
        const documentsMetadata = await uploadDocuments(documents);
        
        if (controller.signal.aborted) {
          throw new Error('Upload cancelled');
        }
        
        const exportId = `EXP-${Date.now()}`;
        const exportRequest: Omit<ExportRequest, 'status'> = {
          id: exportId,
          exportId,
          documents: documentsMetadata,
          exporter: exporterId,
          exporterId: exporterId,
          tradeDetails: {
            productType: '',
            quantity: 0,
            unitPrice: 0,
            totalValue: 0,
            currency: 'USD',
            destination: '',
            contractNumber: '',
          },
          validationSummary: {
            totalValidations: 0,
            completedValidations: 0,
            passedValidations: 0,
            failedValidations: 0,
          },
          timestamp: Date.now(),
        };

        setStatus('submitting');
        setProgress({
          current: 1,
          total: 1,
          message: 'Submitting to blockchain...',
        });

        let retries = 0;
        let lastError: Error | null = null;

        while (retries < MAX_RETRIES && !controller.signal.aborted) {
          try {
            const txHash = await contract.submitExport(exportRequest);
            setStatus('success');
            setProgress(null);
            toast.success('Export submitted successfully!');
            return { txHash, exportId };
          } catch (err) {
            lastError = err instanceof Error ? err : new Error('Failed to submit export');
            retries++;
            
            if (retries < MAX_RETRIES) {
              toast.warning(`Retrying submission (${retries}/${MAX_RETRIES})...`);
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * Math.pow(2, retries))
              );
            }
          }
        }

        throw lastError || new Error('Failed to submit export after multiple attempts');
      } catch (err) {
        if (!controller.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Failed to submit export');
          setStatus('error');
          setError(error);
          toast.error(`Submission failed: ${error.message}`);
          throw error;
        }
        throw new Error('Operation cancelled');
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [uploadDocuments]
  );

  const verifyDocument = useCallback(async (exportId: string, docType: string) => {
    try {
      return await contract.verifyDocument(exportId, docType);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to verify document');
      setError(error);
      throw error;
    }
  }, []);

  const getDocument = useCallback((exportId: string, docType: string) => 
    contract.getDocument(exportId, docType).catch(err => {
      const error = err instanceof Error ? err : new Error('Failed to get document');
      setError(error);
      throw error;
    })
  , []);

  const getExportRequest = useCallback((exportId: string) => 
    contract.getExportRequest(exportId).catch(err => {
      const error = err instanceof Error ? err : new Error('Failed to get export request');
      setError(error);
      throw error;
    })
  , []);

  return {
    submitExport,
    verifyDocument,
    getDocument,
    getExportRequest,
    status,
    error,
    progress,
    cancel,
    reset,
  };
};