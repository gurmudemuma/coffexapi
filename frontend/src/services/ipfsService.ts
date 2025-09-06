import { create } from 'ipfs-http-client';
import * as aesjs from 'aes-js';
import { generateDiagnosticReport, analyzeDcrytedData } from '@/utils/documentDiagnostics';
import { analyzeEncryptionKey, testKeyCompatibility, generateCompatibilityReport } from '@/utils/keyCompatibilityChecker';

// Configuration for local IPFS node
const IPFS_CONFIG = {
  GATEWAY_URL: 'http://localhost:8090/ipfs',
  API_URL: 'http://localhost:5001',
  // Alternative public gateway for fallback
  PUBLIC_GATEWAY: 'https://ipfs.io/ipfs',
  // Public gateway API endpoint
  PUBLIC_GATEWAY_API: 'https://ipfs.io/api/v0',
  // Additional fallback public gateway
  FALLBACK_GATEWAY: 'https://cloudflare-ipfs.com/ipfs',
  // Public gateway API endpoint for fallback
  FALLBACK_GATEWAY_API: 'https://cloudflare-ipfs.com/api/v0'
};

// Import IPFS HTTP client types
import type { IPFSHTTPClient } from 'ipfs-http-client';

// Initialize IPFS client with better error handling
let ipfs: IPFSHTTPClient | null = null;

try {
  ipfs = create({ 
    url: IPFS_CONFIG.API_URL,
    timeout: 10000 // 10 second timeout
  });
  console.log('Connected to local IPFS node');
} catch (error) {
  console.warn('Failed to connect to local IPFS node. Some features may be limited.', error);
}

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
  console.log('=== ENCRYPTION DEBUG START ===');
  
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);
  console.log('Original file size:', fileBytes.length);
  
  // Check if it's a PDF file
  if (fileBytes.length >= 4) {
    const header = Array.from(fileBytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log('Original file header:', header);
    const isPDF = fileBytes[0] === 0x25 && fileBytes[1] === 0x50 && fileBytes[2] === 0x44 && fileBytes[3] === 0x46;
    console.log('Is valid PDF before encryption:', isPDF);
  }

  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  console.log('Generated IV:', Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''));

  // Convert hex secret key to bytes (the key is already a 64-char hex string)
  console.log('Secret key length:', secretKey.length);
  const keyHexPairs = secretKey.match(/.{1,2}/g);
  if (!keyHexPairs || keyHexPairs.length !== 32) {
    throw new Error(`Invalid encryption key format: expected 64 hex chars, got ${secretKey.length}`);
  }
  const keyBytes = new Uint8Array(keyHexPairs.map(pair => parseInt(pair, 16)));
  console.log('Key bytes length:', keyBytes.length);

  // Add PKCS7 padding
  const paddedData = aesjs.padding.pkcs7.pad(fileBytes);
  console.log('Padded data length:', paddedData.length);
  console.log('Padding added:', paddedData.length - fileBytes.length, 'bytes');
  
  // Encrypt the file
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
  const encryptedBytes = aesCbc.encrypt(paddedData);
  console.log('Encrypted data length:', encryptedBytes.length);
  
  console.log('=== ENCRYPTION DEBUG END ===');

  return {
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
    ciphertext: encryptedBytes,
  };
};

/**
 * Uploads a file to IPFS with optional encryption and progress tracking
 * Uses local IPFS node if available, falls back to public gateways if not
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
  
  // First try with local IPFS node
  if (ipfs) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      let fileToUpload: Blob | Uint8Array = file;
      let fileSize = file.size;
      let encryptionKey = '';
      let iv = '';
      
      try {
        throwIfAborted();

        // Encrypt the file if encryption is enabled
        if (encrypt) {
          console.log('Starting encryption process...');
          encryptionKey = generateEncryptionKey();
          console.log('Generated encryption key length:', encryptionKey.length);
          const encryptionResult = await encryptFile(file, encryptionKey);
          console.log('Encryption completed, creating blob...');
          const encryptedBlob = new Blob(
            [new Uint8Array(encryptionResult.ciphertext)],
            { type: 'application/octet-stream' }
          );
          fileToUpload = encryptedBlob;
          fileSize = encryptedBlob.size;
          iv = encryptionResult.iv;
          console.log('Encrypted blob size:', fileSize);
          console.log('IV generated:', iv);
          
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
            .then((result: { path: string }) => {
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
              console.error('Local IPFS upload failed:', error);
              reject(error);
            });
        });

        return await uploadPromise;
      } catch (error: unknown) {
        lastError = error as Error;
        
        // Don't retry if the operation was aborted
        if (signal?.aborted || (error as Error).name === 'AbortError') {
          throw error;
        }
        
        // Log the error and retry if we have attempts left
        console.warn(`Upload attempt ${attempt} failed:`, error);
        console.warn('Error details:', {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack
        });
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
          );
        }
      }
    }
  }
  
  // If we get here, local IPFS upload failed
  console.error('Local IPFS upload failed after all retries');
  
  // Create a more helpful error message
  const errorMessage = lastError 
    ? `IPFS upload failed: ${lastError.message}. Please ensure your local IPFS node is running and accessible at ${IPFS_CONFIG.API_URL}`
    : 'IPFS upload failed: Local IPFS node is not available. Please ensure your IPFS service is running.';
    
  throw new Error(errorMessage);
};

/**
 * Downloads and decrypts a file from IPFS with enhanced error handling
 */
export async function downloadFromIPFS(
  cid: string,
  options: {
    iv?: string;
    key?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<Blob> {
  console.log('[DEBUG] downloadFromIPFS called with:', { cid, hasKey: !!options.key, hasIV: !!options.iv });
  
  try {
    // For now, we'll implement a basic fetch that can be enhanced later
    // with proper IPFS gateway integration and decryption
    const ipfsUrl = `${IPFS_CONFIG.GATEWAY_URL}/${cid}`;
    console.log('[DEBUG] Fetching from IPFS URL:', ipfsUrl);
    
    const response = await fetch(ipfsUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
    }

    // Get the content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
    console.log('[DEBUG] Content length:', totalBytes);

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
    let blob = new Blob(chunks.map((chunk) => new Uint8Array(chunk)));
    console.log('[DEBUG] Raw blob size:', blob.size);

    // If we have encryption key and IV, attempt decryption
    if (options.key && options.iv) {
      try {
        console.log('[DEBUG] Starting decryption process');
        console.log('=== COMPREHENSIVE DECRYPTION RECOVERY START ===');
        console.log('Document CID:', cid);
        console.log('Key (first 8 chars):', options.key.substring(0, 8) + '...');
        console.log('IV (first 8 chars):', options.iv.substring(0, 8) + '...');
        console.log('Encrypted data size:', blob.size);
        
        // Convert blob to array buffer for decryption
        const arrayBuffer = await blob.arrayBuffer();
        const encryptedData = new Uint8Array(arrayBuffer);
        console.log('Encrypted data bytes length:', encryptedData.length);
        
        // Show first few bytes of encrypted data for debugging
        const firstBytes = Array.from(encryptedData.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        console.log('First 16 bytes of encrypted data:', firstBytes);
        
        // Check if the data is already decrypted (starts with PDF header)
        const pdfHeader = [0x25, 0x50, 0x44, 0x46]; // %PDF
        const dataHeader = Array.from(encryptedData.slice(0, 4));
        const isAlreadyPDF = pdfHeader.every((byte, index) => byte === dataHeader[index]);
        
        if (isAlreadyPDF) {
          console.log('Document appears to be already decrypted (PDF header found)');
          blob = new Blob([encryptedData], { type: 'application/pdf' });
          console.log('[DEBUG] Already decrypted blob created with size:', blob.size, 'and type:', blob.type);
          return blob;
        }
        
        // Try multiple decryption strategies
        const decryptionStrategies = [
          { name: 'Current Key Format', keyConverter: (key: string) => {
            const pairs = key.match(/.{1,2}/g);
            return new Uint8Array(pairs?.map(byte => parseInt(byte, 16)) || []);
          }},
          { name: 'Text Encoded Key (Legacy)', keyConverter: (key: string) => {
            return new Uint8Array(new TextEncoder().encode(key.substring(0, 32)));
          }},
          { name: 'Direct String Key', keyConverter: (key: string) => {
            const bytes = new Uint8Array(32);
            for (let i = 0; i < Math.min(key.length, 32); i++) {
              bytes[i] = key.charCodeAt(i);
            }
            return bytes;
          }},
          // New strategy: Handle hex strings more carefully
          { name: 'Hex String Key (Strict)', keyConverter: (key: string) => {
            // Ensure the key is exactly 64 characters (32 bytes as hex)
            if (key.length !== 64) {
              throw new Error(`Invalid key length: expected 64 chars, got ${key.length}`);
            }
            
            // Validate that it's a valid hex string
            if (!/^[0-9a-fA-F]+$/.test(key)) {
              throw new Error('Key contains non-hex characters');
            }
            
            const bytes = new Uint8Array(32);
            for (let i = 0; i < 32; i++) {
              const byteHex = key.substr(i * 2, 2);
              bytes[i] = parseInt(byteHex, 16);
            }
            return bytes;
          }}
        ];
        
        let successfulDecryption: Uint8Array | null = null;
        let decryptionMethod = '';
        
        for (const strategy of decryptionStrategies) {
          try {
            console.log(`\n--- Trying ${strategy.name} ---`);
            
            // Validate and convert key and IV
            const keyHexPairs = options.key.match(/.{1,2}/g);
            const ivHexPairs = options.iv.match(/.{1,2}/g);
            
            if (!keyHexPairs || keyHexPairs.length !== 32) {
              console.log(`Invalid key format for ${strategy.name}`);
              continue;
            }
            if (!ivHexPairs || ivHexPairs.length !== 16) {
              console.log(`Invalid IV format for ${strategy.name}`);
              continue;
            }
            
            // Use the strategy's key converter
            let keyBytes: Uint8Array;
            try {
              keyBytes = strategy.keyConverter(options.key);
            } catch (keyError) {
              console.log(`Key conversion failed for ${strategy.name}:`, (keyError as Error).message);
              continue;
            }
            
            const ivBytes = new Uint8Array(ivHexPairs.map(byte => parseInt(byte, 16)));
            
            console.log(`Key bytes length: ${keyBytes.length}`);
            console.log(`IV bytes length: ${ivBytes.length}`);
            
            // Check if encrypted data length is valid for CBC mode
            if (encryptedData.length % 16 !== 0) {
              console.log(`Invalid encrypted data length for ${strategy.name}`);
              continue;
            }
            
            // Decrypt using AES-256-CBC
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            const decryptedBytes = aesCbc.decrypt(encryptedData);
            console.log(`Decrypted ${decryptedBytes.length} bytes with ${strategy.name}`);
            
            // Try different padding removal strategies
            const paddingMethods = ['pkcs7', 'manual', 'none', 'search'];
            
            for (const paddingMethod of paddingMethods) {
              try {
                let processedBytes: Uint8Array;
                
                if (paddingMethod === 'pkcs7') {
                  processedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);
                } else if (paddingMethod === 'manual') {
                  const lastByte = decryptedBytes[decryptedBytes.length - 1];
                  if (lastByte > 0 && lastByte <= 16) {
                    const paddingBytes = decryptedBytes.slice(-lastByte);
                    const allSamePadding = paddingBytes.every(b => b === lastByte);
                    if (allSamePadding) {
                      processedBytes = decryptedBytes.slice(0, -lastByte);
                    } else {
                      processedBytes = decryptedBytes;
                    }
                  } else {
                    processedBytes = decryptedBytes;
                  }
                } else if (paddingMethod === 'search') {
                  processedBytes = findPDFContent(decryptedBytes);
                } else {
                  processedBytes = decryptedBytes;
                }
                
                console.log(`${paddingMethod} padding: ${processedBytes.length} bytes`);
                
                // Check if result is a valid PDF
                const pdfHeader = [0x25, 0x50, 0x44, 0x46]; // %PDF
                const dataHeader = Array.from(processedBytes.slice(0, 4));
                const isPDF = pdfHeader.every((byte, index) => byte === dataHeader[index]);
                
                if (isPDF) {
                  console.log(`\n✓ SUCCESS! Found valid PDF with ${strategy.name} + ${paddingMethod} padding`);
                  console.log('PDF header confirmed:', dataHeader.map(b => b.toString(16).padStart(2, '0')).join(' '));
                  
                  // Additional validation - check for PDF structure
                  const dataString = new TextDecoder('latin1').decode(processedBytes);
                  const hasEOF = dataString.includes('%%EOF');
                  console.log('PDF has EOF marker:', hasEOF);
                  
                  successfulDecryption = processedBytes;
                  decryptionMethod = `${strategy.name} + ${paddingMethod} padding`;
                  break;
                }
                
              } catch (paddingError) {
                console.log(`${paddingMethod} padding failed:`, (paddingError as Error).message || paddingError);
              }
            }
            
            if (successfulDecryption) break;
            
          } catch (strategyError) {
            console.log(`${strategy.name} failed:`, (strategyError as Error).message || strategyError);
          }
        }
        
        if (successfulDecryption) {
          console.log(`\n✓ DECRYPTION SUCCESSFUL using ${decryptionMethod}`);
          // Handle both ArrayBuffer and SharedArrayBuffer
          let bufferData: ArrayBuffer;
          // Check if SharedArrayBuffer is available (only in secure contexts)
          if (typeof SharedArrayBuffer !== 'undefined' && successfulDecryption.buffer instanceof SharedArrayBuffer) {
            // Create a new ArrayBuffer from SharedArrayBuffer
            const tempView = new Uint8Array(successfulDecryption.buffer);
            const newBuffer = new ArrayBuffer(tempView.length);
            const newView = new Uint8Array(newBuffer);
            newView.set(tempView);
            bufferData = newBuffer;
          } else {
            bufferData = successfulDecryption.buffer.slice(
              successfulDecryption.byteOffset,
              successfulDecryption.byteOffset + successfulDecryption.byteLength
            );
          }
          blob = new Blob([bufferData], { type: 'application/pdf' });
          console.log('[DEBUG] Decrypted blob created with size:', blob.size, 'and type:', blob.type);
        } else {
          console.log('\n⚠ ALL DECRYPTION STRATEGIES FAILED');
          console.log('Initiating advanced key compatibility analysis...');
          
          // Step 1: Analyze the encryption keys
          const keyAnalysis = analyzeEncryptionKey(options.key, options.iv);
          console.log('\nKEY ANALYSIS RESULTS:');
          console.log('- Key format:', keyAnalysis.keyFormat);
          console.log('- Valid format:', keyAnalysis.isValid);
          console.log('- Confidence:', keyAnalysis.confidence + '%');
          
          if (keyAnalysis.possibleIssues.length > 0) {
            console.log('- Issues found:', keyAnalysis.possibleIssues.length);
            keyAnalysis.possibleIssues.forEach((issue, index) => {
              console.log(`  ${index + 1}. ${issue}`);
            });
          }
          
          // Step 2: Test key compatibility with different methods
          console.log('\nTESTING KEY COMPATIBILITY...');
          try {
            const compatibilityTests = await testKeyCompatibility(encryptedData, options.key, options.iv);
            
            console.log('COMPATIBILITY TEST RESULTS:');
            compatibilityTests.forEach((test, index) => {
              console.log(`${index + 1}. ${test.method.toUpperCase()}:`);
              console.log(`   - Success: ${test.success}`);
              console.log(`   - Entropy: ${test.entropy.toFixed(2)}/8.0 ${test.entropy < 7.0 ? '✓ Good' : '⚠ High'}`);
              console.log(`   - Valid Structure: ${test.hasValidStructure ? '✓ Yes' : '⚠ No'}`);
              console.log(`   - Details: ${test.details}`);
            });
            
            // Generate comprehensive compatibility report
            const compatibilityReport = generateCompatibilityReport(keyAnalysis, compatibilityTests);
            console.log('\n' + compatibilityReport);
            
            // Check if any method was successful
            const successfulTest = compatibilityTests.find(test => test.success);
            if (successfulTest) {
              console.log(`\n✓ FOUND WORKING METHOD: ${successfulTest.method}`);
              console.log('This indicates the issue may be with the current decryption implementation.');
              console.log('Consider updating the decryption logic to use the working method.');
            } else {
              console.log('\n⚠ NO COMPATIBLE DECRYPTION METHODS FOUND');
              console.log('This strongly indicates one of the following:');
              console.log('1. The document was encrypted with completely different parameters');
              console.log('2. The encryption keys stored in the database are incorrect');
              console.log('3. The document is not actually encrypted (wrong file uploaded)');
              console.log('4. The file is corrupted beyond recovery');
            }
            
          } catch (compatibilityError) {
            console.error('Key compatibility testing failed:', compatibilityError);
            console.log('\n⚠ COMPATIBILITY TESTING UNAVAILABLE');
            console.log('Falling back to standard diagnostic analysis...');
            
            // When compatibility testing fails, we can still analyze the decrypted data
            const keyBytes = new Uint8Array(options.key.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
            const ivBytes = new Uint8Array(options.iv.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
            
            try {
              const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
              const testSample = aesCbc.decrypt(encryptedData.slice(0, 1024)); // Test first 1KB
              
              // Quick entropy check
              const frequency = new Array(256).fill(0);
              for (const byte of testSample) {
                frequency[byte]++;
              }
              
              let entropy = 0;
              for (const freq of frequency) {
                if (freq > 0) {
                  const p = freq / testSample.length;
                  entropy -= p * Math.log2(p);
                }
              }
              
              console.log('FALLBACK ENTROPY ANALYSIS:');
              console.log(`- Sample entropy: ${entropy.toFixed(2)}/8.0`);
              console.log(`- Classification: ${entropy > 7.5 ? 'High (Random/Encrypted)' : entropy > 5.0 ? 'Medium' : 'Low (Structured)'}`);
              
              if (entropy > 7.5) {
                console.log('\n❗ CONFIRMED: Maximum entropy indicates fundamental decryption failure');
                console.log('This confirms the encryption keys are incompatible with the encrypted data.');
              }
              
            } catch (fallbackError) {
              console.error('Even fallback analysis failed:', fallbackError);
            }
          }
          
          // Step 3: Perform diagnostic analysis as before
          try {
            const keyBytes = new Uint8Array(options.key.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
            const ivBytes = new Uint8Array(options.iv.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            const diagnosticBytes = aesCbc.decrypt(encryptedData);
            
            // Generate comprehensive diagnostic report
            const diagnosticReport = generateDiagnosticReport(diagnosticBytes, cid);
            console.log('\n' + diagnosticReport);
            
            // Analyze the data for specific issues
            const analysis = analyzeDcrytedData(diagnosticBytes);
            
            console.log('\nDIAGNOSTIC SUMMARY:');
            console.log('- Detected file type:', analysis.fileType);
            console.log('- Confidence level:', analysis.confidence + '%');
            console.log('- Issues found:', analysis.issues.length);
            console.log('- Recommendations:', analysis.suggestions.length);
            
            // Provide specific guidance based on the analysis
            if (analysis.issues.length > 0) {
              console.log('\nSPECIFIC ISSUES:');
              analysis.issues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue}`);
              });
            }
            
            if (analysis.suggestions.length > 0) {
              console.log('\nRECOMMENDATIONS:');
              analysis.suggestions.forEach((suggestion, index) => {
                console.log(`${index + 1}. ${suggestion}`);
              });
            }
            
            // Final determination based on entropy and compatibility
            if (analysis.issues.some(issue => issue.includes('entropy'))) {
              console.log('\n❗ CRITICAL ANALYSIS:');
              console.log('Maximum entropy detected indicates complete decryption failure.');
              console.log('This is NOT a padding or format issue - the keys are fundamentally incompatible.');
              console.log('\nIMMEDIATE ACTIONS REQUIRED:');
              console.log('1. Verify the document was uploaded correctly');
              console.log('2. Check if encryption keys were stored properly in database');
              console.log('3. Request complete re-upload of the document');
              console.log('4. Consider implementing key validation during upload');
            }
            
            // Provide raw data for download with enhanced metadata
            // Handle both ArrayBuffer and SharedArrayBuffer
            let bufferData: ArrayBuffer;
            // Check if SharedArrayBuffer is available (only in secure contexts)
            if (typeof SharedArrayBuffer !== 'undefined' && diagnosticBytes.buffer instanceof SharedArrayBuffer) {
              // Create a new ArrayBuffer from SharedArrayBuffer
              const tempView = new Uint8Array(diagnosticBytes.buffer);
              const newBuffer = new ArrayBuffer(tempView.length);
              const newView = new Uint8Array(newBuffer);
              newView.set(tempView);
              bufferData = newBuffer;
            } else {
              bufferData = diagnosticBytes.buffer.slice(
                diagnosticBytes.byteOffset,
                diagnosticBytes.byteOffset + diagnosticBytes.byteLength
              );
            }
            blob = new Blob([bufferData], { 
              type: 'application/octet-stream'
            });
            console.log('[DEBUG] Diagnostic blob created with size:', blob.size, 'and type:', blob.type);
            
          } catch (diagnosticError) {
            console.error('Diagnostic analysis also failed:', diagnosticError);
            console.log('\n⚠ COMPLETE SYSTEM FAILURE');
            console.log('Both compatibility testing and diagnostic analysis failed.');
            console.log('This indicates a fundamental system or data integrity issue.');
            console.log('\nEMERGENCY ACTIONS:');
            console.log('1. Contact system administrator immediately');
            console.log('2. Preserve the document CID and keys for technical analysis');
            console.log('3. Request immediate re-upload of the document');
            console.log('4. Consider system integrity check');
            
            // Provide encrypted data as last resort
            // Handle both ArrayBuffer and SharedArrayBuffer
            let bufferData: ArrayBuffer;
            // Check if SharedArrayBuffer is available (only in secure contexts)
            if (typeof SharedArrayBuffer !== 'undefined' && encryptedData.buffer instanceof SharedArrayBuffer) {
              // Create a new ArrayBuffer from SharedArrayBuffer
              const tempView = new Uint8Array(encryptedData.buffer);
              const newBuffer = new ArrayBuffer(tempView.length);
              const newView = new Uint8Array(newBuffer);
              newView.set(tempView);
              bufferData = newBuffer;
            } else {
              bufferData = encryptedData.buffer.slice(
                encryptedData.byteOffset,
                encryptedData.byteOffset + encryptedData.byteLength
              );
            }
            blob = new Blob([bufferData], { type: 'application/octet-stream' });
            console.log('[DEBUG] Encrypted blob created with size:', blob.size, 'and type:', blob.type);
          }
        }
        
        console.log('=== COMPREHENSIVE DECRYPTION RECOVERY END ===');
      } catch (decryptError) {
        console.error('=== DECRYPTION ERROR ===');
        console.error('Decryption failed:', decryptError);
        console.error('Providing encrypted data as binary download');
        console.error('=== DECRYPTION ERROR END ===');
      }
    }

    console.log('[DEBUG] Final blob size:', blob.size, 'and type:', blob.type);
    return blob;
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    throw error;
  }
}

/**
 * Helper function to find PDF content in decrypted data
 */
function findPDFContent(data: Uint8Array): Uint8Array {
  // Look for PDF header (%PDF) in the decrypted data
  const pdfHeader = [0x25, 0x50, 0x44, 0x46]; // %PDF
  
  for (let i = 0; i <= data.length - 4; i++) {
    if (data[i] === pdfHeader[0] && 
        data[i + 1] === pdfHeader[1] && 
        data[i + 2] === pdfHeader[2] && 
        data[i + 3] === pdfHeader[3]) {
      console.log(`Found PDF header at offset ${i}`);
      return data.slice(i);
    }
  }
  
  console.log('No PDF header found in decrypted data');
  return data; // Return original data if no PDF header found
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
