/**
 * Base64 Document Service
 * Stores documents as Base64 strings in blockchain/database
 * Provides immediate access without external dependencies
 */

export interface Base64DocumentResult {
  documentId: string;
  base64Data: string;
  dataUrl: string; // data:mime;base64,xxxxx format
  metadata: {
    fileName: string;
    fileSize: number;
    contentType: string;
    uploadTimestamp: string;
  };
}

/**
 * Convert file to Base64 and store in system
 */
export const uploadAsBase64 = async (
  file: File,
  options: {
    onProgress?: (status: string, progress: number) => void;
    maxSizeKB?: number; // Default 5MB limit
  } = {}
): Promise<Base64DocumentResult> => {
  const { onProgress, maxSizeKB = 5120 } = options; // 5MB default

  console.log('=== BASE64 DOCUMENT UPLOAD START ===');
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);

  // Check file size limit
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB > maxSizeKB) {
    throw new Error(`File too large: ${fileSizeKB.toFixed(1)}KB exceeds limit of ${maxSizeKB}KB`);
  }

  try {
    // Phase 1: Convert to Base64
    if (onProgress) onProgress('Converting to Base64...', 0.1);

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix to get just the Base64 data
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file as Base64'));
        }
      };
      
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });

    if (onProgress) onProgress('Storing document...', 0.6);

    // Phase 2: Create data URL for immediate viewing
    const dataUrl = `data:${file.type};base64,${base64Data}`;
    
    // Phase 3: Store in system (could be blockchain, database, etc.)
    const documentId = generateDocumentId();
    
    const documentData = {
      documentId,
      base64Data,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      uploadTimestamp: new Date().toISOString()
    };

    // Store in local storage as example (in production, this would go to API)
    localStorage.setItem(`document_${documentId}`, JSON.stringify(documentData));

    if (onProgress) onProgress('Upload completed!', 1.0);

    console.log('✅ Base64 upload successful:', documentId);
    console.log('Base64 data length:', base64Data.length);
    console.log('=== BASE64 DOCUMENT UPLOAD COMPLETE ===');

    return {
      documentId,
      base64Data,
      dataUrl,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        uploadTimestamp: documentData.uploadTimestamp
      }
    };

  } catch (error) {
    console.error('❌ Base64 upload failed:', error);
    throw error;
  }
};

/**
 * Access Base64 document (instant access for approvers)
 */
export const accessBase64Document = async (
  documentId: string
): Promise<{
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  metadata?: any;
  error?: string;
}> => {
  console.log('=== ACCESSING BASE64 DOCUMENT ===');
  console.log('Document ID:', documentId);

  try {
    // Retrieve from storage (in production, this would be from API/blockchain)
    const storedData = localStorage.getItem(`document_${documentId}`);
    
    if (!storedData) {
      return {
        success: false,
        error: 'Document not found'
      };
    }

    const documentData = JSON.parse(storedData);
    const dataUrl = `data:${documentData.contentType};base64,${documentData.base64Data}`;
    
    // Convert to Blob for download functionality
    const byteCharacters = atob(documentData.base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: documentData.contentType });

    console.log('✅ Successfully accessed Base64 document');
    console.log('Content-Type:', documentData.contentType);
    console.log('Size:', blob.size);

    return {
      success: true,
      dataUrl,
      blob,
      metadata: {
        fileName: documentData.fileName,
        contentType: documentData.contentType,
        size: blob.size,
        uploadTimestamp: documentData.uploadTimestamp
      }
    };

  } catch (error) {
    console.error('❌ Base64 document access failed:', error);
    return {
      success: false,
      error: `Failed to access document: ${error}`
    };
  }
};

/**
 * Generate unique document ID
 */
function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all stored Base64 documents (for approvers)
 */
export const getAllBase64Documents = (): Array<{
  documentId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadTimestamp: string;
}> => {
  const documents = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('document_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        documents.push({
          documentId: data.documentId,
          fileName: data.fileName,
          fileSize: data.fileSize,
          contentType: data.contentType,
          uploadTimestamp: data.uploadTimestamp
        });
      } catch (error) {
        console.warn('Failed to parse document:', key);
      }
    }
  }
  
  return documents.sort((a, b) => 
    new Date(b.uploadTimestamp).getTime() - new Date(a.uploadTimestamp).getTime()
  );
};

/**
 * Remove Base64 document
 */
export const removeBase64Document = (documentId: string): boolean => {
  try {
    localStorage.removeItem(`document_${documentId}`);
    return true;
  } catch (error) {
    console.error('Failed to remove document:', error);
    return false;
  }
};