// IPFS Configuration
export const IPFS_CONFIG = {
  // Infura IPFS project ID (replace with your own in production)
  PROJECT_ID:
    process.env.REACT_APP_INFURA_PROJECT_ID || 'YOUR_INFURA_PROJECT_ID',

  // Infura IPFS project secret (replace with your own in production)
  PROJECT_SECRET:
    process.env.REACT_APP_INFURA_PROJECT_SECRET || 'YOUR_INFURA_PROJECT_SECRET',

  // IPFS gateway URL for fetching content
  GATEWAY_URL: 'https://ipfs.io/ipfs',

  // List of supported file types and their max sizes (in bytes)
  SUPPORTED_TYPES: {
    'application/pdf': 10 * 1024 * 1024, // 10MB
    'application/msword': 5 * 1024 * 1024, // 5MB
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      5 * 1024 * 1024, // 5MB
    'image/jpeg': 5 * 1024 * 1024, // 5MB
    'image/png': 5 * 1024 * 1024, // 5MB
  },

  // Maximum number of files that can be uploaded at once
  MAX_FILES: 10,

  // Encryption settings
  ENCRYPTION: {
    // Key length in bytes (32 bytes = 256 bits for AES-256)
    KEY_LENGTH: 32,
    // Initialization Vector length in bytes (16 bytes for AES-CBC)
    IV_LENGTH: 16,
  },
};

// Helper function to get MIME type from filename
export const getFileType = (filename: string): string | null => {
  const extension = filename.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',

    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',

    // Spreadsheets
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
  };

  return extension ? mimeTypes[extension] || null : null;
};

// Validate file against our configuration
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  const fileType = getFileType(file.name);

  if (!fileType) {
    return {
      valid: false,
      error: 'Unsupported file type',
    };
  }

  const maxSize =
    IPFS_CONFIG.SUPPORTED_TYPES[
      fileType as keyof typeof IPFS_CONFIG.SUPPORTED_TYPES
    ];

  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size for ${fileType} is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};
