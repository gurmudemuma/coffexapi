/**
 * Key Compatibility Checker
 * Helps identify if encryption keys are compatible with decryption attempts
 */

import * as aesjs from 'aes-js';

interface KeyAnalysisResult {
  isValid: boolean;
  keyFormat: 'hex' | 'base64' | 'raw' | 'unknown';
  possibleIssues: string[];
  suggestions: string[];
  confidence: number;
}

interface EncryptionTestResult {
  success: boolean;
  method: string;
  entropy: number;
  hasValidStructure: boolean;
  details: string;
}

/**
 * Analyze encryption key format and validity
 */
export function analyzeEncryptionKey(key: string, iv: string): KeyAnalysisResult {
  const result: KeyAnalysisResult = {
    isValid: false,
    keyFormat: 'unknown',
    possibleIssues: [],
    suggestions: [],
    confidence: 0
  };

  // Check key format
  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    result.keyFormat = 'hex';
    result.isValid = true;
    result.confidence = 90;
  } else if (/^[A-Za-z0-9+/]{43}=$/.test(key)) {
    result.keyFormat = 'base64';
    result.possibleIssues.push('Key appears to be base64 encoded, but system expects hex');
    result.suggestions.push('Convert base64 key to hex format');
    result.confidence = 70;
  } else if (key.length === 32) {
    result.keyFormat = 'raw';
    result.possibleIssues.push('Key appears to be raw 32-byte string');
    result.suggestions.push('Key may need to be hex-encoded');
    result.confidence = 60;
  } else {
    result.possibleIssues.push(`Invalid key length: ${key.length} characters`);
    result.suggestions.push('Key should be 64 hex characters (32 bytes)');
    result.confidence = 10;
  }

  // Check IV format
  if (!/^[0-9a-fA-F]{32}$/.test(iv)) {
    result.possibleIssues.push(`Invalid IV format or length: ${iv.length} characters`);
    result.suggestions.push('IV should be 32 hex characters (16 bytes)');
    result.isValid = false;
  }

  // Additional checks
  if (key === iv) {
    result.possibleIssues.push('Key and IV are identical - this is insecure');
    result.suggestions.push('Regenerate with different key and IV');
  }

  if (result.possibleIssues.length === 0 && result.isValid) {
    result.suggestions.push('Key format appears valid for AES-256-CBC decryption');
  }

  return result;
}

/**
 * Test different key derivation methods to find the correct one
 */
export async function testKeyCompatibility(
  encryptedData: Uint8Array, 
  key: string, 
  iv: string
): Promise<EncryptionTestResult[]> {
  const results: EncryptionTestResult[] = [];
  
  // Test 1: Standard hex key conversion
  try {
    const testResult = await testDecryptionMethod(
      encryptedData, 
      key, 
      iv, 
      'hex-standard',
      (k) => new Uint8Array(k.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
    );
    results.push(testResult);
  } catch (error) {
    results.push({
      success: false,
      method: 'hex-standard',
      entropy: 0,
      hasValidStructure: false,
      details: `Failed: ${(error as Error).message}`
    });
  }

  // Test 2: Text encoder method (legacy compatibility)
  try {
    const testResult = await testDecryptionMethod(
      encryptedData, 
      key, 
      iv, 
      'text-encoded',
      (k) => new Uint8Array(new TextEncoder().encode(k.substring(0, 32)))
    );
    results.push(testResult);
  } catch (error) {
    results.push({
      success: false,
      method: 'text-encoded',
      entropy: 0,
      hasValidStructure: false,
      details: `Failed: ${(error as Error).message}`
    });
  }

  // Test 3: Base64 decoded key (if applicable)
  if (/^[A-Za-z0-9+/]+=*$/.test(key)) {
    try {
      const testResult = await testDecryptionMethod(
        encryptedData, 
        key, 
        iv, 
        'base64-decoded',
        (k) => new Uint8Array(atob(k).split('').map(c => c.charCodeAt(0)).slice(0, 32))
      );
      results.push(testResult);
    } catch (error) {
      results.push({
        success: false,
        method: 'base64-decoded',
        entropy: 0,
        hasValidStructure: false,
        details: `Failed: ${(error as Error).message}`
      });
    }
  }

  // Test 4: Direct byte interpretation
  try {
    const testResult = await testDecryptionMethod(
      encryptedData, 
      key, 
      iv, 
      'direct-bytes',
      (k) => {
        const bytes = new Uint8Array(32);
        for (let i = 0; i < Math.min(k.length, 32); i++) {
          bytes[i] = k.charCodeAt(i);
        }
        return bytes;
      }
    );
    results.push(testResult);
  } catch (error) {
    results.push({
      success: false,
      method: 'direct-bytes',
      entropy: 0,
      hasValidStructure: false,
      details: `Failed: ${(error as Error).message}`
    });
  }

  return results;
}

/**
 * Test a specific decryption method
 */
async function testDecryptionMethod(
  encryptedData: Uint8Array,
  key: string,
  iv: string,
  methodName: string,
  keyConverter: (key: string) => Uint8Array
): Promise<EncryptionTestResult> {
  const keyBytes = keyConverter(key);
  const ivBytes = new Uint8Array(iv.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
  
  if (keyBytes.length !== 32) {
    throw new Error(`Invalid key length: ${keyBytes.length} bytes`);
  }
  
  if (ivBytes.length !== 16) {
    throw new Error(`Invalid IV length: ${ivBytes.length} bytes`);
  }

  // Perform decryption on a small sample to test compatibility
  const sampleSize = Math.min(1024, encryptedData.length); // Test with first 1KB
  const sampleData = encryptedData.slice(0, sampleSize);
  
  // Ensure sample size is multiple of 16 for CBC mode
  const adjustedSize = Math.floor(sampleSize / 16) * 16;
  const adjustedSample = sampleData.slice(0, adjustedSize);
  
  if (adjustedSample.length === 0) {
    throw new Error('Insufficient data for compatibility testing');
  }
  
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
  const decryptedBytes = aesCbc.decrypt(adjustedSample);
  
  // Calculate entropy
  const entropy = calculateEntropy(decryptedBytes);
  
  // Check for valid file structure
  const hasValidStructure = checkForValidFileStructure(decryptedBytes);
  
  // Success criteria: low entropy OR valid structure (either indicates success)
  const success = entropy < 7.0 || hasValidStructure;
  
  return {
    success,
    method: methodName,
    entropy,
    hasValidStructure,
    details: success 
      ? `Success: ${entropy < 7.0 ? 'Low entropy' : 'Valid structure'} (${entropy.toFixed(2)})`
      : `Failed: High entropy (${entropy.toFixed(2)}) and no valid structure`
  };
}

/**
 * Calculate data entropy
 */
function calculateEntropy(data: Uint8Array): number {
  const frequency = new Array(256).fill(0);
  for (const byte of data) {
    frequency[byte]++;
  }

  let entropy = 0;
  for (const freq of frequency) {
    if (freq > 0) {
      const p = freq / data.length;
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}

/**
 * Check if decrypted data has valid file structure
 */
function checkForValidFileStructure(data: Uint8Array): boolean {
  if (data.length < 4) return false;
  
  // Check for known file signatures
  const signatures = [
    [0x25, 0x50, 0x44, 0x46], // PDF
    [0x89, 0x50, 0x4E, 0x47], // PNG
    [0xFF, 0xD8, 0xFF],        // JPEG
    [0x50, 0x4B, 0x03, 0x04],  // ZIP
    [0xD0, 0xCF, 0x11, 0xE0],  // DOC
  ];

  for (const signature of signatures) {
    if (signature.every((byte, index) => data[index] === byte)) {
      return true;
    }
  }

  // Check for text-like content (printable ASCII)
  let printableCount = 0;
  const sampleSize = Math.min(100, data.length);
  
  for (let i = 0; i < sampleSize; i++) {
    const byte = data[i];
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      printableCount++;
    }
  }

  return (printableCount / sampleSize) > 0.7;
}

/**
 * Generate a comprehensive compatibility report
 */
export function generateCompatibilityReport(
  keyAnalysis: KeyAnalysisResult,
  testResults: EncryptionTestResult[]
): string {
  let report = `=== ENCRYPTION KEY COMPATIBILITY REPORT ===\n\n`;
  
  report += `KEY ANALYSIS:\n`;
  report += `- Format: ${keyAnalysis.keyFormat}\n`;
  report += `- Valid: ${keyAnalysis.isValid}\n`;
  report += `- Confidence: ${keyAnalysis.confidence}%\n\n`;
  
  if (keyAnalysis.possibleIssues.length > 0) {
    report += `ISSUES FOUND:\n`;
    keyAnalysis.possibleIssues.forEach((issue, index) => {
      report += `${index + 1}. ${issue}\n`;
    });
    report += `\n`;
  }
  
  report += `DECRYPTION TESTS:\n`;
  testResults.forEach((result, index) => {
    report += `${index + 1}. ${result.method.toUpperCase()}:\n`;
    report += `   - Success: ${result.success}\n`;
    report += `   - Entropy: ${result.entropy.toFixed(2)}/8.0\n`;
    report += `   - Valid Structure: ${result.hasValidStructure}\n`;
    report += `   - Details: ${result.details}\n\n`;
  });
  
  const successfulTests = testResults.filter(r => r.success);
  if (successfulTests.length > 0) {
    report += `RECOMMENDED SOLUTION:\n`;
    report += `Use the "${successfulTests[0].method}" decryption method.\n\n`;
  } else {
    report += `CRITICAL ISSUE:\n`;
    report += `All decryption methods failed. The document may be:\n`;
    report += `1. Encrypted with different parameters\n`;
    report += `2. Corrupted during storage or transmission\n`;
    report += `3. Not actually encrypted (wrong file uploaded)\n`;
    report += `4. Using an incompatible encryption algorithm\n\n`;
  }
  
  report += `RECOMMENDATIONS:\n`;
  keyAnalysis.suggestions.forEach((suggestion, index) => {
    report += `${index + 1}. ${suggestion}\n`;
  });
  
  report += `\n=== END COMPATIBILITY REPORT ===`;
  
  return report;
}