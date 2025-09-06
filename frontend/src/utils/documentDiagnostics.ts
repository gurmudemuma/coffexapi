/**
 * Document Diagnostics Utility
 * Helps identify issues with encrypted documents and provides recovery suggestions
 */

interface DiagnosticResult {
  isValid: boolean;
  fileType: string;
  issues: string[];
  suggestions: string[];
  confidence: number; // 0-100
}

interface FileSignature {
  name: string;
  signature: number[];
  description: string;
}

// Common file signatures for identification
const FILE_SIGNATURES: FileSignature[] = [
  { name: 'PDF', signature: [0x25, 0x50, 0x44, 0x46], description: 'PDF Document' },
  { name: 'PNG', signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], description: 'PNG Image' },
  { name: 'JPEG', signature: [0xFF, 0xD8, 0xFF], description: 'JPEG Image' },
  { name: 'GIF', signature: [0x47, 0x49, 0x46], description: 'GIF Image' },
  { name: 'ZIP', signature: [0x50, 0x4B, 0x03, 0x04], description: 'ZIP Archive' },
  { name: 'RAR', signature: [0x52, 0x61, 0x72, 0x21], description: 'RAR Archive' },
  { name: 'DOC', signature: [0xD0, 0xCF, 0x11, 0xE0], description: 'Microsoft Word Document' },
  { name: 'DOCX', signature: [0x50, 0x4B, 0x03, 0x04], description: 'Microsoft Word Document (DOCX)' },
  { name: 'XLS', signature: [0xD0, 0xCF, 0x11, 0xE0], description: 'Microsoft Excel Document' },
  { name: 'XLSX', signature: [0x50, 0x4B, 0x03, 0x04], description: 'Microsoft Excel Document (XLSX)' },
  { name: 'TXT', signature: [], description: 'Plain Text' }, // No specific signature
];

/**
 * Analyze decrypted data to identify potential issues
 */
export function analyzeDcrytedData(data: Uint8Array): DiagnosticResult {
  const result: DiagnosticResult = {
    isValid: false,
    fileType: 'Unknown',
    issues: [],
    suggestions: [],
    confidence: 0
  };

  // Check if data is empty
  if (data.length === 0) {
    result.issues.push('Decrypted data is empty');
    result.suggestions.push('Check if the original file was uploaded successfully');
    result.suggestions.push('Verify encryption keys are correct');
    return result;
  }

  // Check file signature
  const detectedType = detectFileType(data);
  result.fileType = detectedType.name;
  result.confidence = detectedType.confidence;

  if (detectedType.name === 'PDF') {
    result.isValid = true;
    result.suggestions.push('File appears to be a valid PDF');
  } else if (detectedType.name !== 'Unknown') {
    result.issues.push(`File appears to be ${detectedType.description}, not a PDF`);
    result.suggestions.push('Verify the original file was a PDF before upload');
    result.suggestions.push('Convert the file to PDF format before re-uploading');
  } else {
    result.issues.push('File type could not be determined');
    result.suggestions.push('File may be corrupted or use an unknown format');
  }

  // Check for encryption artifacts
  const entropyAnalysis = analyzeEntropy(data);
  if (entropyAnalysis.highEntropy && detectedType.name === 'Unknown') {
    result.issues.push('High entropy data suggests the file is still encrypted or corrupted');
    result.suggestions.push('Verify the decryption keys are correct');
    result.suggestions.push('Check if the file was double-encrypted');
  }

  // Check for common corruption patterns
  const corruptionCheck = checkForCorruption(data);
  if (corruptionCheck.isCorrupted) {
    result.issues.push('Data shows signs of corruption');
    result.suggestions.push('Request the exporter to re-upload the original file');
    result.suggestions.push('Verify file integrity before encryption');
  }

  // Provide specific recommendations based on the raw data pattern
  analyzeRawDataPattern(data, result);

  return result;
}

/**
 * Detect file type based on signature
 */
function detectFileType(data: Uint8Array): { name: string; confidence: number; description: string } {
  for (const sig of FILE_SIGNATURES) {
    if (sig.signature.length === 0) continue; // Skip signatures with no pattern
    
    if (data.length >= sig.signature.length) {
      const matches = sig.signature.every((byte, index) => data[index] === byte);
      if (matches) {
        return { name: sig.name, confidence: 95, description: sig.description };
      }
    }
  }

  // Try to detect text files
  if (isLikelyTextFile(data)) {
    return { name: 'TXT', confidence: 70, description: 'Plain Text File' };
  }

  return { name: 'Unknown', confidence: 0, description: 'Unknown File Type' };
}

/**
 * Analyze data entropy to detect encryption or corruption
 */
function analyzeEntropy(data: Uint8Array): { highEntropy: boolean; entropy: number } {
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

  return {
    highEntropy: entropy > 7.5, // High entropy suggests random/encrypted data
    entropy
  };
}

/**
 * Check for common corruption patterns
 */
function checkForCorruption(data: Uint8Array): { isCorrupted: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check for excessive null bytes
  const nullBytes = Array.from(data).filter(byte => byte === 0).length;
  const nullPercentage = (nullBytes / data.length) * 100;
  
  if (nullPercentage > 50) {
    reasons.push('Excessive null bytes detected');
  }

  // Check for repeated patterns that might indicate padding issues
  const firstByte = data[0];
  let sameByteCount = 0;
  for (const byte of data) {
    if (byte === firstByte) sameByteCount++;
  }
  
  if (sameByteCount / data.length > 0.8) {
    reasons.push('Excessive repetition of the same byte value');
  }

  return {
    isCorrupted: reasons.length > 0,
    reasons
  };
}

/**
 * Check if data appears to be a text file
 */
function isLikelyTextFile(data: Uint8Array): boolean {
  const sample = data.slice(0, Math.min(1000, data.length));
  let printableChars = 0;
  
  for (const byte of sample) {
    // Check for printable ASCII characters
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      printableChars++;
    }
  }
  
  return (printableChars / sample.length) > 0.8;
}

/**
 * Analyze the specific raw data pattern from the logs
 */
function analyzeRawDataPattern(data: Uint8Array, result: DiagnosticResult): void {
  // The pattern from the logs: a4 a1 fa 7f b1 d2 fc d8 ca c2 9c ce fc 5d e4 1c
  const loggedPattern = [0xa4, 0xa1, 0xfa, 0x7f, 0xb1, 0xd2, 0xfc, 0xd8, 0xca, 0xc2, 0x9c, 0xce, 0xfc, 0x5d, 0xe4, 0x1c];
  
  if (data.length >= 16) {
    const actualPattern = Array.from(data.slice(0, 16));
    const matches = loggedPattern.every((byte, index) => byte === actualPattern[index]);
    
    if (matches) {
      result.issues.push('Data matches the failed decryption pattern from console logs');
      result.suggestions.push('This specific pattern indicates a systematic encryption/decryption mismatch');
      result.suggestions.push('The original PDF was likely corrupted during the encryption process');
      result.suggestions.push('Re-upload the document using the improved encryption system');
    }
  }

  // Check for high-entropy random data (common in failed decryption)
  const entropy = analyzeEntropy(data);
  if (entropy.highEntropy) {
    result.issues.push(`Very high data entropy (${entropy.entropy.toFixed(2)}/8.0) suggests random data`);
    result.suggestions.push('This pattern is typical of incorrectly decrypted or corrupted data');
  }
}

/**
 * Generate a comprehensive diagnostic report
 */
export function generateDiagnosticReport(data: Uint8Array, documentName: string): string {
  const analysis = analyzeDcrytedData(data);
  
  let report = `=== DOCUMENT DIAGNOSTIC REPORT ===\n`;
  report += `Document: ${documentName}\n`;
  report += `Data Size: ${data.length} bytes (${(data.length / 1024).toFixed(2)} KB)\n`;
  report += `Detected Type: ${analysis.fileType}\n`;
  report += `Confidence: ${analysis.confidence}%\n\n`;

  if (analysis.issues.length > 0) {
    report += `ISSUES DETECTED:\n`;
    analysis.issues.forEach((issue, index) => {
      report += `${index + 1}. ${issue}\n`;
    });
    report += `\n`;
  }

  if (analysis.suggestions.length > 0) {
    report += `RECOMMENDATIONS:\n`;
    analysis.suggestions.forEach((suggestion, index) => {
      report += `${index + 1}. ${suggestion}\n`;
    });
    report += `\n`;
  }

  // Add raw data preview
  const preview = Array.from(data.slice(0, 32))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
  report += `RAW DATA PREVIEW (first 32 bytes):\n${preview}\n\n`;

  report += `=== END DIAGNOSTIC REPORT ===`;
  
  return report;
}