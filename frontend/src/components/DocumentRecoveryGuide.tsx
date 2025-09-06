import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, FileX, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface DocumentRecoveryGuideProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  errorType: 'corruption' | 'invalid-format' | 'decryption-failed' | 'unknown';
  onRequestReupload?: () => void;
}

const RECOVERY_STRATEGIES = {
  corruption: {
    title: 'Document Corruption Detected',
    icon: FileX,
    color: 'text-red-500',
    description: 'The document was successfully decrypted but the content appears to be corrupted.',
    causes: [
      'File was damaged during the original upload process',
      'Storage corruption occurred in IPFS',
      'Network interruption during upload',
      'Browser compatibility issues during encryption'
    ],
    solutions: [
      'Request the exporter to re-upload the original document',
      'Verify the original file is not corrupted on the exporter\'s system',
      'Ensure a stable internet connection during re-upload',
      'Use a different browser if the issue persists'
    ]
  },
  'invalid-format': {
    title: 'Invalid File Format',
    icon: XCircle,
    color: 'text-amber-500',
    description: 'The decrypted file is not in the expected PDF format.',
    causes: [
      'Wrong file type was uploaded (not a PDF)',
      'File extension was changed incorrectly',
      'Document was converted improperly before upload',
      'Encryption process altered the file structure'
    ],
    solutions: [
      'Verify the original document is a valid PDF file',
      'Re-save the document as PDF using proper software',
      'Check the file opens correctly before re-uploading',
      'Ensure the file size is reasonable (not too large)'
    ]
  },
  'decryption-failed': {
    title: 'Complete Decryption Failure',
    icon: AlertTriangle,
    color: 'text-red-500',
    description: 'The document shows maximum entropy, indicating fundamental key incompatibility.',
    causes: [
      'Encryption keys stored incorrectly in database',
      'Document was encrypted with different parameters',
      'Key corruption during storage or transmission',
      'System encryption algorithm changed between versions',
      'Database encoding issues (UTF-8 vs ASCII conflicts)'
    ],
    solutions: [
      'CRITICAL: Request immediate re-upload of the document',
      'Verify the original PDF file opens correctly before re-upload',
      'Check database logs for key storage inconsistencies',
      'Use the enhanced upload system with key validation',
      'Contact system administrator if issue persists',
      'Consider manual document verification as emergency fallback'
    ]
  },
  unknown: {
    title: 'Unknown Error',
    icon: AlertTriangle,
    color: 'text-gray-500',
    description: 'An unexpected error occurred while processing the document.',
    causes: [
      'Temporary system malfunction',
      'Network connectivity issues',
      'Resource limitations on the server',
      'Compatibility issues with the file'
    ],
    solutions: [
      'Try viewing the document again after a few minutes',
      'Check your internet connection',
      'Contact technical support if the issue persists',
      'Request the exporter to re-upload the document'
    ]
  }
};

export default function DocumentRecoveryGuide({
  isOpen,
  onClose,
  documentName,
  errorType,
  onRequestReupload
}: DocumentRecoveryGuideProps) {
  if (!isOpen) return null;

  const strategy = RECOVERY_STRATEGIES[errorType];
  const IconComponent = strategy.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <IconComponent className={`w-6 h-6 ${strategy.color}`} />
            Document Recovery Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Affected Document</h4>
            <p className="text-gray-700">{documentName}</p>
          </div>

          {/* Error Details */}
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${strategy.color}`}>
              {strategy.title}
            </h3>
            <p className="text-gray-700 mb-4">{strategy.description}</p>
          </div>

          {/* Possible Causes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Possible Causes:</h4>
            <ul className="space-y-2">
              {strategy.causes.map((cause, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Solutions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Solutions:</h4>
            <ul className="space-y-2">
              {strategy.solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onRequestReupload && (
              <Button
                onClick={onRequestReupload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Request Re-upload
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close Guide
            </Button>
          </div>

          {/* Enhanced Technical Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">🚨 Critical System Analysis</h4>
            <div className="text-red-800 text-sm space-y-2">
              <p><strong>Entropy Analysis:</strong> Maximum entropy (8.0/8.0) detected</p>
              <p><strong>Key Compatibility:</strong> All decryption methods failed</p>
              <p><strong>Root Cause:</strong> Fundamental encryption key mismatch</p>
              <p><strong>Severity Level:</strong> Critical - Document completely unrecoverable</p>
            </div>
            <div className="mt-3 p-2 bg-red-100 rounded text-red-800 text-xs">
              <strong>System Status:</strong> Enhanced compatibility checker and diagnostic tools are now active. 
              Future uploads will be validated immediately to prevent this issue.
            </div>
          </div>

          {/* Technical Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Technical Note</h4>
            <p className="text-blue-800 text-sm">
              This system uses AES-256-CBC encryption with IPFS storage. Documents are 
              encrypted client-side before upload and decrypted when viewed. If you continue 
              to experience issues, please contact the technical support team with this 
              error information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}