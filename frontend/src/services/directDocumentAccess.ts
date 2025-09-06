/**
 * Direct Document Access Service
 * Provides alternative ways to access documents when decryption fails
 */

interface DirectAccessOptions {
  usePublicGateway?: boolean;
  skipDecryption?: boolean;
  downloadAsFile?: boolean;
}

interface DirectAccessResult {
  success: boolean;
  method: string;
  url?: string;
  blob?: Blob;
  error?: string;
  suggestions?: string[];
  metadata?: {
    contentType?: string;
    contentLength?: string;
    isEncrypted?: boolean;
    accessSuccessful?: boolean;
  };
}

/**
 * Direct IPFS access bypassing encryption/decryption
 */
export class DirectDocumentAccess {
  private static IPFS_GATEWAYS = [
    'http://localhost:8090/ipfs',     // Local IPFS
    'https://ipfs.io/ipfs',           // Public IPFS
    'https://cloudflare-ipfs.com/ipfs', // Cloudflare IPFS
    'https://gateway.pinata.cloud/ipfs', // Pinata
    'https://dweb.link/ipfs'          // Protocol Labs
  ];

  /**
   * Attempt to access document directly from IPFS without decryption
   */
  static async accessDirectly(
    ipfsCid: string, 
    options: DirectAccessOptions = {}
  ): Promise<DirectAccessResult> {
    
    const { usePublicGateway = false, downloadAsFile = true } = options;
    
    console.log('=== DIRECT DOCUMENT ACCESS START ===');
    console.log('IPFS CID:', ipfsCid);
    console.log('Options:', options);
    
    // Try different access methods
    const accessMethods = [
      { name: 'Local IPFS Gateway', gateway: this.IPFS_GATEWAYS[0] },
      { name: 'Public IPFS Gateway', gateway: this.IPFS_GATEWAYS[1] },
      { name: 'Cloudflare IPFS', gateway: this.IPFS_GATEWAYS[2] },
      { name: 'Pinata Gateway', gateway: this.IPFS_GATEWAYS[3] },
      { name: 'DWeb Gateway', gateway: this.IPFS_GATEWAYS[4] }
    ];

    for (const method of accessMethods) {
      try {
        console.log(`\\n--- Trying ${method.name} ---`);
        const result = await this.tryGatewayAccess(ipfsCid, method.gateway, method.name);
        
        if (result.success) {
          console.log(`✅ SUCCESS with ${method.name}`);
          return result;
        } else {
          console.log(`❌ Failed with ${method.name}: ${result.error}`);
        }
        
      } catch (error) {
        console.log(`❌ ${method.name} failed:`, (error as Error).message);
      }
    }

    // If all gateways fail, provide fallback options
    console.log('\\n⚠️ ALL DIRECT ACCESS METHODS FAILED');
    return {
      success: false,
      method: 'none',
      error: 'All IPFS gateways failed to access the document',
      suggestions: [
        'The document may not be properly pinned to IPFS',
        'Network connectivity issues may be preventing access',
        'The IPFS CID may be incorrect or corrupted',
        'Try again in a few minutes as IPFS propagation can be slow',
        'Contact the exporter to verify the document was uploaded correctly'
      ]
    };
  }

  /**
   * Try accessing document through a specific IPFS gateway
   */
  private static async tryGatewayAccess(
    cid: string, 
    gateway: string, 
    methodName: string
  ): Promise<DirectAccessResult> {
    
    const url = `${gateway}/${cid}`;
    console.log(`Attempting access via: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/octet-stream,*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentLength = response.headers.get('content-length');
      
      console.log(`Response: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${contentType}`);
      console.log(`Content-Length: ${contentLength} bytes`);

      // Get the document data
      const blob = await response.blob();
      
      // Validate the content
      const validation = await this.validateDirectContent(blob, contentType);
      
      return {
        success: validation.isValid,
        method: methodName,
        url: url,
        blob: blob,
        error: validation.isValid ? undefined : validation.error,
        suggestions: validation.suggestions,
        // Add metadata for better user feedback
        metadata: {
          contentType: contentType,
          contentLength: contentLength || undefined,
          isEncrypted: !validation.isValid && validation.error?.includes('encrypted'),
          accessSuccessful: true // We got the file, even if encrypted
        }
      };

    } catch (error) {
      return {
        success: false,
        method: methodName,
        error: (error as Error).message
      };
    }
  }

  /**
   * Validate the directly accessed content
   */
  private static async validateDirectContent(
    blob: Blob, 
    contentType: string
  ): Promise<{
    isValid: boolean;
    error?: string;
    suggestions?: string[];
  }> {
    
    // Check file size
    if (blob.size === 0) {
      return {
        isValid: false,
        error: 'Document is empty (0 bytes)',
        suggestions: ['The document may not have been uploaded correctly']
      };
    }

    if (blob.size < 100) {
      return {
        isValid: false,
        error: 'Document is too small (less than 100 bytes)',
        suggestions: ['This may be an error message rather than the actual document']
      };
    }

    // Check if content appears to be encrypted
    if (await this.looksEncrypted(blob)) {
      return {
        isValid: false,
        error: 'Document appears to be encrypted',
        suggestions: [
          'This document was stored encrypted in IPFS',
          'Direct access without decryption will not work for this document',
          'The document exists but requires proper decryption keys',
          'Contact system administrator about the encryption key mismatch',
          'Request the exporter to verify the document upload process'
        ]
      };
    }

    // Check for PDF content
    if (await this.isPDF(blob)) {
      return {
        isValid: true,
        suggestions: ['Document appears to be a valid PDF file']
      };
    }

    // Check for other valid file types
    const fileType = await this.detectFileType(blob);
    if (fileType !== 'Unknown') {
      return {
        isValid: true,
        suggestions: [`Document appears to be a valid ${fileType} file`]
      };
    }

    return {
      isValid: true, // Allow unknown files to be downloaded
      suggestions: [
        'Document type could not be determined',
        'File may still be valid - try downloading and opening manually'
      ]
    };
  }

  /**
   * Check if blob appears to be encrypted (high entropy)
   */
  private static async looksEncrypted(blob: Blob): Promise<boolean> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer.slice(0, Math.min(1024, arrayBuffer.byteLength)));
    
    // Calculate entropy of first 1KB
    const frequency = new Array(256).fill(0);
    for (const byte of bytes) {
      frequency[byte]++;
    }

    let entropy = 0;
    for (const freq of frequency) {
      if (freq > 0) {
        const p = freq / bytes.length;
        entropy -= p * Math.log2(p);
      }
    }

    // High entropy (> 7.5) suggests encrypted/random data
    return entropy > 7.5;
  }

  /**
   * Check if blob is a PDF file
   */
  private static async isPDF(blob: Blob): Promise<boolean> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    if (bytes.length < 4) return false;
    
    // Check for PDF header
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }

  /**
   * Detect file type based on signature
   */
  private static async detectFileType(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    const signatures = [
      { name: 'PDF', signature: [0x25, 0x50, 0x44, 0x46] },
      { name: 'PNG', signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
      { name: 'JPEG', signature: [0xFF, 0xD8, 0xFF] },
      { name: 'ZIP', signature: [0x50, 0x4B, 0x03, 0x04] },
      { name: 'DOC', signature: [0xD0, 0xCF, 0x11, 0xE0] }
    ];

    for (const sig of signatures) {
      if (bytes.length >= sig.signature.length) {
        if (sig.signature.every((byte, index) => bytes[index] === byte)) {
          return sig.name;
        }
      }
    }

    return 'Unknown';
  }

  /**
   * Generate a direct access URL for embedding
   */
  static generateDirectURL(ipfsCid: string, gateway: string = 'https://ipfs.io/ipfs'): string {
    return `${gateway}/${ipfsCid}`;
  }

  /**
   * Create a download link for the document
   */
  static createDownloadLink(blob: Blob, filename: string = 'document'): string {
    return URL.createObjectURL(blob);
  }
}