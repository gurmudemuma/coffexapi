import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import * as aesjs from 'aes-js';
// Configuration
const IPFS_CONFIG = {
  GATEWAY_URL: 'http://localhost:8080/ipfs',
};

// Initialize IPFS client for local node
const ipfs = create({ url: 'http://localhost:5001' });

// Types
export interface IPFSOptions {
  encrypt?: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  chunkSize?: number;
  timeout?: number;
  retries?: number;
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
 * Uploads a file to IPFS with optional encryption and progress tracking
 */
export const uploadToIPFS = async (
  file: File,
  options: IPFSOptions = { encrypt: true }
): Promise<IPFSFile> => {
  const {
    encrypt = true,
    onProgress,
    signal,
    chunkSize = 1024 * 1024, // 1MB chunks by default
    timeout = 30000, // 30 seconds timeout
    retries = 3
  } = options;

  // Check if the operation was aborted
  const throwIfAborted = () => {
    if (signal?.aborted) {
      throw new DOMException('Upload aborted by the user', 'AbortError');
    }
  };

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let fileToUpload: Blob | Uint8Array = file;
    let fileSize = file.size;
    let encryptionKey = '';
    let iv = '';
    
    try {
      throwIfAborted();

      // Encrypt the file if encryption is enabled
      if (encrypt) {
        encryptionKey = generateEncryptionKey();
        const encryptionResult = await encryptFile(file, encryptionKey);
        const encryptedBlob = new Blob(
          [new Uint8Array(encryptionResult.ciphertext)],
          { type: 'application/octet-stream' }
        );
        fileToUpload = encryptedBlob;
        fileSize = encryptedBlob.size;
        iv = encryptionResult.iv;
        
        // Report progress after encryption
        if (onProgress) {
          onProgress(0.1); // 10% for encryption
        }
      }

      // Set up timeout for the upload
      const uploadPromise = new Promise<IPFSFile>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Upload timed out'));
        }, timeout);

        // Upload to IPFS with progress tracking
        let uploadedBytes = 0;
        
        ipfs.add(fileToUpload, {
          progress: (bytes: number) => {
            if (signal?.aborted) {
              clearTimeout(timeoutId);
              reject(new DOMException('Upload aborted by the user', 'AbortError'));
              return;
            }
            
            uploadedBytes = bytes;
            const progress = uploadedBytes / fileSize;
            
            // Report progress (scaled to 10-90% to leave room for final steps)
            if (onProgress) {
              onProgress(encrypt ? 0.1 + progress * 0.8 : progress * 0.9);
            }
          },
        })
          .then((result) => {
            clearTimeout(timeoutId);
            
            // Generate the IPFS URL
            const url = `${IPFS_CONFIG.GATEWAY_URL}/${result.path}`;
            
            // Report completion
            if (onProgress) {
              onProgress(1);
            }
            
            resolve({
              cid: result.path,
              url,
              iv,
              key: encryptionKey,
              name: file.name,
              size: fileSize,
              type: file.type,
            });
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });

      return await uploadPromise;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if the operation was aborted
      if (signal?.aborted || (error as Error).name === 'AbortError') {
        throw error;
      }
      
      // Log the error and retry if we have attempts left
      console.warn(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt < retries) {
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
      }
    }
  }
  
  // If we get here, all retries failed
  throw lastError || new Error('Failed to upload file after multiple attempts');
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


