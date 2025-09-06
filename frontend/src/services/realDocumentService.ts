/**
 * Real Document Service - Handles both encrypted and unencrypted document storage
 * This stores the actual PDF content for approvers while maintaining security
 */

import { uploadToIPFS } from './ipfsService';

export interface RealDocumentResult {
  success: boolean;
  encryptedCid?: string;
  unencryptedCid?: string;
  error?: string;
  metadata: {
    originalFileName: string;
    fileSize: number;
    contentType: string;
    uploadTimestamp: string;
  };
}

/**
 * Upload document with both encrypted and unencrypted versions for real data access
 */
export const uploadRealDocument = async (
  file: File,
  options: {
    onProgress?: (phase: string, progress: number) => void;
  } = {}
): Promise<RealDocumentResult> => {
  const { onProgress } = options;

  console.log('=== REAL DOCUMENT UPLOAD START ===');
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);

  try {
    // Phase 1: Upload unencrypted version (for approvers - real data)
    if (onProgress) onProgress('Uploading unencrypted version for approvers...', 0);
    
    const unencryptedResult = await uploadToIPFS(file, {
      encrypt: false, // Store actual PDF without encryption
      onProgress: (progress) => {
        if (onProgress) onProgress('Uploading unencrypted version...', progress * 0.5);
      }
    });

    console.log('✅ Unencrypted version (real data) uploaded:', unencryptedResult.cid);

    // Phase 2: Upload encrypted version (for security compliance)
    if (onProgress) onProgress('Uploading encrypted version for security...', 0.5);
    
    const encryptedResult = await uploadToIPFS(file, {
      encrypt: true, // Encrypted for security
      onProgress: (progress) => {
        if (onProgress) onProgress('Uploading encrypted version...', 0.5 + progress * 0.5);
      }
    });

    console.log('✅ Encrypted version uploaded:', encryptedResult.cid);

    // Store mapping in localStorage for demo (in production, store in database)
    const documentMapping = {
      originalCid: encryptedResult.cid, // The encrypted CID that's stored in blockchain
      unencryptedCid: unencryptedResult.cid, // The unencrypted CID for approvers
      encryptedCid: encryptedResult.cid,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      uploadTimestamp: new Date().toISOString()
    };

    localStorage.setItem(`doc_mapping_${encryptedResult.cid}`, JSON.stringify(documentMapping));
    console.log('📋 Document mapping stored:', documentMapping);

    if (onProgress) onProgress('Upload completed!', 1.0);

    return {
      success: true,
      encryptedCid: encryptedResult.cid,
      unencryptedCid: unencryptedResult.cid,
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        uploadTimestamp: documentMapping.uploadTimestamp
      }
    };

  } catch (error) {
    console.error('❌ Real document upload failed:', error);
    return {
      success: false,
      error: `Upload failed: ${error}`,
      metadata: {
        originalFileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        uploadTimestamp: new Date().toISOString()
      }
    };
  }
};

/**
 * Access the real unencrypted document content for approvers
 */
export const accessRealDocument = async (
  originalCid: string,
  options: {
    useLocalGateway?: boolean;
  } = {}
): Promise<{
  success: boolean;
  blob?: Blob;
  url?: string;
  error?: string;
  source?: string;
}> => {
  const { useLocalGateway = true } = options;

  console.log('=== ACCESSING REAL DOCUMENT ===');
  console.log('Original CID:', originalCid);

  try {
    // Check if we have a mapping for this document
    const mappingData = localStorage.getItem(`doc_mapping_${originalCid}`);
    
    if (mappingData) {
      const mapping = JSON.parse(mappingData);
      console.log('📋 Found document mapping:', mapping);
      
      // Access the unencrypted version
      const unencryptedCid = mapping.unencryptedCid;
      console.log('Accessing unencrypted CID:', unencryptedCid);
      
      const gateways = useLocalGateway 
        ? ['http://localhost:8090/ipfs', 'https://ipfs.io/ipfs']
        : ['https://ipfs.io/ipfs'];

      for (const gateway of gateways) {
        try {
          const url = `${gateway}/${unencryptedCid}`;
          console.log('Trying gateway:', url);

          const response = await fetch(url);
          
          if (response.ok) {
            const blob = await response.blob();
            
            // Ensure it's treated as a PDF
            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
            const objectUrl = URL.createObjectURL(pdfBlob);
            
            console.log('✅ Successfully accessed real document');
            console.log('Size:', pdfBlob.size, 'bytes');
            
            return {
              success: true,
              blob: pdfBlob,
              url: objectUrl,
              source: `Unencrypted IPFS (${gateway.split('//')[1]})`
            };
          }
        } catch (error) {
          console.warn(`❌ Gateway ${gateway} failed:`, error);
        }
      }
    } else {
      console.log('⚠️ No mapping found for this document CID');
      return {
        success: false,
        error: 'No unencrypted version available - this document was uploaded before the dual storage system was implemented'
      };
    }

    return {
      success: false,
      error: 'Unable to access unencrypted version from any gateway'
    };

  } catch (error) {
    console.error('❌ Real document access failed:', error);
    return {
      success: false,
      error: `Access failed: ${error}`
    };
  }
};

/**
 * Get all available document mappings
 */
export const getAllDocumentMappings = (): Array<{
  originalCid: string;
  unencryptedCid: string;
  fileName: string;
  fileSize: number;
  uploadTimestamp: string;
}> => {
  const mappings = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('doc_mapping_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        mappings.push({
          originalCid: data.originalCid,
          unencryptedCid: data.unencryptedCid,
          fileName: data.fileName,
          fileSize: data.fileSize,
          uploadTimestamp: data.uploadTimestamp
        });
      } catch (error) {
        console.warn('Failed to parse mapping:', key);
      }
    }
  }
  
  return mappings.sort((a, b) => 
    new Date(b.uploadTimestamp).getTime() - new Date(a.uploadTimestamp).getTime()
  );
};