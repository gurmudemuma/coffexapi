/**
 * Dual Document Service - Stores both encrypted and unencrypted versions
 * Solves the approver access issue by providing direct unencrypted access
 */

import { uploadToIPFS, IPFSFile, IPFSOptions } from './ipfsService';

export interface DualStorageResult {
  // Encrypted version (for security/production)
  encrypted: IPFSFile;
  // Unencrypted version (for approvers)
  unencrypted: IPFSFile;
  // Metadata
  originalFileName: string;
  uploadTimestamp: string;
  fileSize: number;
  contentType: string;
}

/**
 * Upload document with dual storage - both encrypted and unencrypted versions
 */
export const uploadDocumentDual = async (
  file: File,
  options: {
    onProgress?: (phase: string, progress: number) => void;
    signal?: AbortSignal;
  } = {}
): Promise<DualStorageResult> => {
  const { onProgress, signal } = options;

  console.log('=== DUAL DOCUMENT UPLOAD START ===');
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);

  try {
    // Phase 1: Upload encrypted version (for security)
    if (onProgress) onProgress('Uploading encrypted version...', 0);
    
    const encryptedResult = await uploadToIPFS(file, {
      encrypt: true,
      signal,
      onProgress: (progress) => {
        if (onProgress) onProgress('Uploading encrypted version...', progress * 0.5);
      }
    });

    console.log('✅ Encrypted version uploaded:', encryptedResult.cid);

    // Phase 2: Upload unencrypted version (for approvers)
    if (onProgress) onProgress('Uploading unencrypted version for approvers...', 0.5);
    
    const unencryptedResult = await uploadToIPFS(file, {
      encrypt: false, // No encryption for approver access
      signal,
      onProgress: (progress) => {
        if (onProgress) onProgress('Uploading unencrypted version for approvers...', 0.5 + progress * 0.5);
      }
    });

    console.log('✅ Unencrypted version uploaded:', unencryptedResult.cid);

    const result: DualStorageResult = {
      encrypted: encryptedResult,
      unencrypted: unencryptedResult,
      originalFileName: file.name,
      uploadTimestamp: new Date().toISOString(),
      fileSize: file.size,
      contentType: file.type
    };

    if (onProgress) onProgress('Upload completed!', 1.0);
    console.log('=== DUAL DOCUMENT UPLOAD COMPLETE ===');
    
    return result;

  } catch (error) {
    console.error('❌ Dual upload failed:', error);
    throw error;
  }
};

/**
 * Access unencrypted document directly (for approvers)
 * For existing documents, try to access them as PDFs by setting correct MIME type
 */
export const accessUnencryptedDocument = async (
  documentCid: string,
  options: {
    useLocalGateway?: boolean;
    downloadAsFile?: boolean;
  } = {}
): Promise<{
  success: boolean;
  blob?: Blob;
  url?: string;
  error?: string;
}> => {
  const { useLocalGateway = true, downloadAsFile = false } = options;

  console.log('=== ACCESSING UNENCRYPTED DOCUMENT ===');
  console.log('CID:', documentCid);

  const gateways = useLocalGateway 
    ? ['http://localhost:8090/ipfs', 'https://ipfs.io/ipfs']
    : ['https://ipfs.io/ipfs'];

  for (const gateway of gateways) {
    try {
      const url = `${gateway}/${documentCid}`;
      console.log('Trying gateway:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/*,*/*'
        }
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        // Check if this looks like a PDF file
        const isPDF = bytes.length >= 4 && 
                     bytes[0] === 0x25 && bytes[1] === 0x50 && 
                     bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
        
        if (isPDF) {
          console.log('✅ Found valid PDF document');
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          
          if (downloadAsFile) {
            const objectUrl = URL.createObjectURL(blob);
            return {
              success: true,
              blob,
              url: objectUrl
            };
          }
          
          return {
            success: true,
            blob,
            url
          };
        } else {
          console.log('⚠️ Document appears to be encrypted or corrupted');
          // Still return the data but mark as encrypted
          const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          return {
            success: false,
            blob,
            error: 'Document appears to be encrypted - contains non-PDF data'
          };
        }
      }
    } catch (error) {
      console.warn(`❌ Gateway ${gateway} failed:`, error);
    }
  }

  return {
    success: false,
    error: 'All gateways failed to access document'
  };
};

/**
 * Helper function to get document metadata
 */
export const getDocumentMetadata = async (cid: string): Promise<{
  exists: boolean;
  size?: number;
  type?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`http://localhost:8090/ipfs/${cid}`, {
      method: 'HEAD'
    });

    if (response.ok) {
      return {
        exists: true,
        size: parseInt(response.headers.get('content-length') || '0'),
        type: response.headers.get('content-type') || 'unknown'
      };
    }

    return { exists: false, error: 'Document not found' };
  } catch (error) {
    return { exists: false, error: `Network error: ${error}` };
  }
};