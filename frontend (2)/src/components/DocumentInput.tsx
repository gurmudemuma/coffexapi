import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Lock, X, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUpload } from './ui/FormComponents';
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      await processFile(file);
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (disabled) {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="relative">
          <div 
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              'bg-muted cursor-not-allowed'
            )}
          >
            <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Document submission disabled
            </p>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {state.loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={state.loading}
        />
        
        {state.file ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{state.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(state.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={state.loading}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {state.loading && (
              <div className="mt-2">
                <div className="w-full bg-secondary-200 dark:bg-secondary-800 rounded-full h-1">
                  <div 
                    className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            )}
            
            {state.cid && (
              <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Uploaded to IPFS: {state.cid}</span>
              </div>
            )}
          </div>
        ) : (
          <div 
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
              isDragging 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              state.error && 'border-red-500'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept && `Accepted: ${accept.replace(/\./g, '').toUpperCase()} • `}
              Max 10MB
            </p>
          </div>
        )}
      </div>
      
      {state.error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {state.error}
        </p>
      )}
      
      {description && !state.error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}