import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Lock, X } from 'lucide-react';
import { Button } from './ui/button';
// Remove the problematic import and use a simple cn utility function
const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');
import {
  uploadToIPFS,
  generateEncryptionKey,
  validateFile,
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
    key: null, // Add missing required key property
    loading: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with value if provided
  useEffect(() => {
    if (value) {
      setState((prev) => ({
        ...prev,
        file: null, // Don't store file in state as it's not serializable
        cid: value.cid || null,
        url: value.url || null,
        iv: value.iv || null,
        key: value.key || null,
        name: value.name || undefined, // Use undefined instead of null for optional fields
        size: value.size,
        type: value.type,
        loading: false,
        error: null,
      }));
    }
  }, [value]);

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  // Handle file drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      await processFile(droppedFile);
    }
  };

  // Process and validate the selected file
  const processFile = async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      const error = validation.error || 'Invalid file';
      const newState = {
        ...state,
        error,
        loading: false,
      };
      setState(newState);
      onError?.(error);
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Generate a secure encryption key
      const encryptionKey = generateEncryptionKey();

      // Upload to IPFS with encryption
      const result = await uploadToIPFS(file, {
        encrypt: true,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        },
      });

      const newState: DocumentState = {
        file,
        cid: result.cid,
        url: result.url,
        iv: result.iv,
        key: result.key || null,
        name: file.name,
        size: file.size,
        type: file.type,
        loading: false,
        error: null,
      };

      setState((prev) => ({
        ...prev,
        ...newState,
        loading: false,
      }));

      // Notify parent component
      onChange(newState);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to process file';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      onError?.(errorMessage);
    }
  };

  // Handle file removal
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    const newState: DocumentState = {
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      loading: false,
      error: null,
    };

    setState((prev) => ({
      ...prev,
      ...newState,
      error: null,
      loading: false,
    }));

    onChange(newState);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get the appropriate icon based on the current state
  const getDocumentIcon = () => {
    if (state.loading) {
      return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
    }
    if (state.cid) {
      return <Lock className="h-10 w-10 text-green-500" />;
    }
    return <FileText className="h-10 w-10 text-primary" />;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={`document-upload-${type}`}
          className="text-sm font-medium"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {state.file && !state.loading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            Remove
          </Button>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div
        className={cn(
          'mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10',
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
          disabled || state.loading ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onClick={() =>
          !disabled && !state.loading && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          id={`document-upload-${type}`}
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || state.loading}
          multiple={false}
        />

        {state.file ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            {getDocumentIcon()}
            <div className="text-sm font-medium truncate max-w-xs">
              {state.file.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(state.file.size)}
              {state.cid && ' • Securely stored on IPFS'}
            </div>
            {state.error && (
              <div className="text-xs text-destructive">{state.error}</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>{' '}
              or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              {accept ? `Supported formats: ${accept}` : 'Any file format'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
