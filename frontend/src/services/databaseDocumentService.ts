/**
 * Database Document Storage Service
 * Alternative to IPFS - stores documents in accessible database/filesystem
 */

export interface DatabaseDocumentResult {
  documentId: string;
  accessUrl: string;
  previewUrl: string;
  downloadUrl: string;
  metadata: {
    fileName: string;
    fileSize: number;
    contentType: string;
    uploadTimestamp: string;
    checksum: string;
  };
}

/**
 * Upload document to database/filesystem (bypasses IPFS entirely)
 */
export const uploadToDatabase = async (
  file: File,
  options: {
    onProgress?: (status: string, progress: number) => void;
    exportId?: string;
    documentType?: string;
  } = {}
): Promise<DatabaseDocumentResult> => {
  const { onProgress, exportId, documentType } = options;

  console.log('=== DATABASE DOCUMENT UPLOAD START ===');
  console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);

  try {
    // Phase 1: Create FormData for file upload
    if (onProgress) onProgress('Preparing document upload...', 0.1);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size.toString());
    formData.append('contentType', file.type);
    
    if (exportId) formData.append('exportId', exportId);
    if (documentType) formData.append('documentType', documentType);

    // Phase 2: Upload to API Gateway
    if (onProgress) onProgress('Uploading to server...', 0.3);

    const response = await fetch('http://localhost:8000/api/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with boundary for FormData
      }
    });

    if (onProgress) onProgress('Processing upload...', 0.8);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (onProgress) onProgress('Upload completed!', 1.0);

    console.log('✅ Database upload successful:', result.documentId);
    console.log('=== DATABASE DOCUMENT UPLOAD COMPLETE ===');

    return {
      documentId: result.documentId,
      accessUrl: `http://localhost:8000/api/documents/${result.documentId}/view`,
      previewUrl: `http://localhost:8000/api/documents/${result.documentId}/preview`,
      downloadUrl: `http://localhost:8000/api/documents/${result.documentId}/download`,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        uploadTimestamp: new Date().toISOString(),
        checksum: result.checksum || 'unknown'
      }
    };

  } catch (error) {
    console.error('❌ Database upload failed:', error);
    throw error;
  }
};

/**
 * Access document from database (direct access for approvers)
 */
export const accessDatabaseDocument = async (
  documentId: string,
  action: 'view' | 'preview' | 'download' = 'view'
): Promise<{
  success: boolean;
  blob?: Blob;
  url?: string;
  metadata?: any;
  error?: string;
}> => {
  console.log('=== ACCESSING DATABASE DOCUMENT ===');
  console.log('Document ID:', documentId, 'Action:', action);

  try {
    const url = `http://localhost:8000/api/documents/${documentId}/${action}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf,application/*,*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to access document: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    console.log('✅ Successfully accessed database document');
    console.log('Content-Type:', blob.type);
    console.log('Size:', blob.size);

    return {
      success: true,
      blob,
      url: objectUrl,
      metadata: {
        contentType: blob.type,
        size: blob.size
      }
    };

  } catch (error) {
    console.error('❌ Database document access failed:', error);
    return {
      success: false,
      error: `Failed to access document: ${error}`
    };
  }
};

/**
 * Get document information from database
 */
export const getDatabaseDocumentInfo = async (documentId: string): Promise<{
  exists: boolean;
  metadata?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`http://localhost:8000/api/documents/${documentId}/info`);
    
    if (!response.ok) {
      return { exists: false, error: 'Document not found' };
    }

    const metadata = await response.json();
    
    return {
      exists: true,
      metadata
    };

  } catch (error) {
    return {
      exists: false,
      error: `Network error: ${error}`
    };
  }
};