import { Upload, FileText, Loader2, Lock, X } from 'lucide-react';
import { useState, useRef, useEffect, ChangeEvent } from 'react';

// Simple utility for conditional class names
const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

import {
  uploadToIPFS,
  generateEncryptionKey,
} from '@/services/ipfsService';

export type DocumentType = 'license' | 'invoice' | 'qualityCert' | 'other';

export interface DocumentState {
  file: File | null;
  cid: string | null;
  url: string | null;
  iv: string | null;
  key: string | null;
  loading: boolean;
  error: string | null;
  name?: string;
  size?: number;
  type?: string;
}

interface DocumentInputProps {
  type: DocumentType;
  onChange: (documentState: DocumentState) => void;
  onError?: (error: string) => void;
  accept?: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  value?: Omit<DocumentState, 'loading' | 'error'>;
}

export function DocumentInput({
  type,
  onChange,
  onError,
  accept = '.pdf,.doc,.docx',
  label = 'Document',
  description = 'Upload a document',
  required = false,
  className,
  disabled = false,
  value,
}: DocumentInputProps) {
  const [state, setState] = useState<DocumentState>({
    file: null,
    cid: null,
    url: null,
    iv: null,
    key: null,
    loading: false,
    error: null,
    ...value,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setState(prev => ({
        ...prev,
        ...value,
        loading: false,
        error: null,
      }));
    }
  }, [value]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setState(prev => ({
      ...prev,
      file,
      loading: true,
      error: null,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    try {
      // Validate file type for PDFs
      if (accept.includes('.pdf') && !file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        throw new Error('Please upload a valid PDF file');
      }
      
      // Validate file content for PDFs by checking file header
      if (accept.includes('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const header = new Uint8Array(arrayBuffer.slice(0, 4));
        const pdfHeader = [0x25, 0x50, 0x44, 0x46]; // %PDF
        const isPDF = pdfHeader.every((byte, index) => byte === header[index]);
        
        if (!isPDF) {
          throw new Error('File is not a valid PDF. Please ensure you are uploading a proper PDF file.');
        }
        
        console.log('PDF file validation passed:', file.name);
      }
      
      // Generate encryption key
      const key = generateEncryptionKey();
      
      // Upload to IPFS
      const { cid, url, iv } = await uploadToIPFS(file, { 
        encrypt: true,
        onProgress: (progress) => {
          // Handle progress updates if needed
          console.log(`Upload progress: ${progress}%`);
        },
      });

      const newState: DocumentState = {
        file,
        cid,
        url,
        iv,
        key,
        loading: false,
        error: null,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setState(newState);
      onChange(newState);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  };

  const handleRemove = () => {
    setState({
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      loading: false,
      error: null,
    });
    onChange({
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      loading: false,
      error: null,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      {state.file ? (
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {state.file.name}
              </span>
              {state.loading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
              {state.cid && !state.loading && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Uploaded
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={state.loading || disabled}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {state.error && (
            <p className="mt-2 text-sm text-red-600">{state.error}</p>
          )}
          
          {state.cid && (
            <div className="mt-2 text-xs text-gray-500">
              <p>IPFS CID: <span className="font-mono">{state.cid}</span></p>
              {state.iv && (
                <p className="mt-1">
                  <Lock className="inline h-3 w-3 mr-1" />
                  Encrypted
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={(
            [
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400',
            ] as string[]
          ).filter(Boolean).join(' ')}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or
              drag and drop
            </div>
            <div className="text-xs text-gray-500">
              {accept ? `${accept.replace(/\./g, ' ').toUpperCase()}` : 'Any file'}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || state.loading}
      />
    </div>
  );
}
