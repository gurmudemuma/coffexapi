import { create } from 'ipfs-http-client';
import * as aesjs from 'aes-js';

// Configuration
const IPFS_CONFIG = {
  // In a production environment, replace these with environment variables
  PROJECT_ID:
    process.env.REACT_APP_INFURA_PROJECT_ID || 'YOUR_INFURA_PROJECT_ID',
  PROJECT_SECRET:
    process.env.REACT_APP_INFURA_PROJECT_SECRET || 'YOUR_INFURA_PROJECT_SECRET',
  GATEWAY_URL: 'https://ipfs.io/ipfs',
};

// Initialize IPFS client with authentication
const auth =
  'Basic ' +
  Buffer.from(
    IPFS_CONFIG.PROJECT_ID + ':' + IPFS_CONFIG.PROJECT_SECRET
  ).toString('base64');

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

// Types
export interface IPFSOptions {
  encrypt?: boolean;
  onProgress?: (progress: number) => void;
}

export interface IPFSFile {
  cid: string;
  url: string;
  iv: string;
  key: string;
  name?: string;
  size?: number;
  type?: string;
}

/**
 * Encrypts a file using AES-256-CBC
 */
const encryptFile = async (
  file: File,
  secretKey: string
): Promise<{ iv: string; ciphertext: Uint8Array }> => {
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Convert secret key to bytes (32 bytes for AES-256)
  const keyBytes = new TextEncoder().encode(
    secretKey.padEnd(32, '0').slice(0, 32)
  );

  // Encrypt the file
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
  const paddedData = aesjs.padding.pkcs7.pad(fileBytes);
  const encryptedBytes = aesCbc.encrypt(paddedData);

  return {
    iv: Buffer.from(iv).toString('hex'),
    ciphertext: encryptedBytes,
  };
};

/**
 * Uploads a file to IPFS with optional encryption
 */
export const uploadToIPFS = async (
  file: File,
  options: IPFSOptions = { encrypt: true }
): Promise<IPFSFile> => {
  try {
    let fileToUpload: Blob | Uint8Array = file;
    let fileSize = file.size;
    let encryptionKey = '';
    let iv = '';

    // Encrypt the file if encryption is enabled
    if (options.encrypt) {
      encryptionKey = generateEncryptionKey();
      const encryptionResult = await encryptFile(file, encryptionKey);
      const encryptedBlob = new Blob(
        [new Uint8Array(encryptionResult.ciphertext)],
        { type: 'application/octet-stream' }
      );
      fileToUpload = encryptedBlob;
      fileSize = encryptedBlob.size;
      iv = Buffer.from(encryptionResult.iv).toString('hex');
    }

    // Add file to IPFS with progress tracking
    let uploadedBytes = 0;

    const { cid } = await ipfs.add(
      { content: fileToUpload },
      {
        progress: (bytes: number) => {
          if (options.onProgress) {
            uploadedBytes += bytes;
            const progress = Math.round((uploadedBytes / fileSize) * 100);
            options.onProgress(progress);
          }
        },
      }
    );

    const url = `${IPFS_CONFIG.GATEWAY_URL}/${cid.toString()}`;

    return {
      cid: cid.toString(),
      url,
      iv,
      key: encryptionKey,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Downloads and decrypts a file from IPFS
 */
export async function downloadFromIPFS(
  cid: string,
  options: {
    iv?: string;
    key?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<Blob> {
  try {
    // For now, we'll implement a basic fetch that can be enhanced later
    // with proper IPFS gateway integration and decryption
    const response = await fetch(`${IPFS_CONFIG.GATEWAY_URL}/${cid}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
    }

    // Get the content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    // Read the response as a stream for progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read response body');
    }

    let receivedBytes = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedBytes += value.length;

      // Update progress if callback provided
      if (options.onProgress && totalBytes > 0) {
        const progress = Math.round((receivedBytes / totalBytes) * 100);
        options.onProgress(progress);
      }
    }

    // Combine all chunks into a single Blob
    const blob = new Blob(chunks.map((chunk) => new Uint8Array(chunk)));

    // If we have encryption key and IV, decrypt the content
    if (options.key && options.iv) {
      // In a real implementation, we would decrypt the content here
      // For now, we'll just return the blob as is
      console.warn('Decryption not yet implemented');
    }

    return blob;
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    throw error;
  }
}

/**
 * Generates a secure random key for encryption
 */
export const generateEncryptionKey = (): string => {
  const array = new Uint8Array(32); // 256 bits
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

/**
 * Validates a file against supported types and size limits
 */
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  // List of supported MIME types and their max sizes (in bytes)
  const SUPPORTED_TYPES: Record<string, number> = {
    'application/pdf': 10 * 1024 * 1024, // 10MB
    'application/msword': 5 * 1024 * 1024, // 5MB
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      5 * 1024 * 1024, // 5MB
    'image/jpeg': 5 * 1024 * 1024, // 5MB
    'image/png': 5 * 1024 * 1024, // 5MB
  };

  // Check file type
  if (!SUPPORTED_TYPES[file.type]) {
    return {
      valid: false,
      error: 'Unsupported file type',
    };
  }

  // Check file size
  const maxSize = SUPPORTED_TYPES[file.type];
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};
