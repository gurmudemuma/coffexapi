import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Loader2,
  Lock,
  Upload as ArrowUpTrayIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
// Simple cn utility since we're having issues with @/lib/utils
const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

// Mock interfaces for now - these should be properly typed in the actual service files
interface IPFSFile {
  cid: string;
  path: string;
  size: number;
}

// Mock functions for now
const uploadToIPFS = async (file: File): Promise<IPFSFile> => {
  // Mock implementation
  return { cid: 'mock-cid', path: 'mock-path', size: file.size };
};

const generateEncryptionKey = (): string => {
  return 'mock-encryption-key';
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  return { valid: true };
};

const hashFile = async (file: File): Promise<string> => {
  return 'mock-file-hash';
};

// Format upload speed
const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) return `${bytesPerSecond} B/s`;
  if (bytesPerSecond < 1024 * 1024)
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
};

// Format time remaining
const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
  speed: string;
  timeRemaining: string;
}

const uploadWithProgress = async (
  file: File,
  onProgress: (progress: UploadProgress) => void
): Promise<IPFSFile> => {
  // Mock implementation
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress >= 100) {
      clearInterval(interval);
      onProgress({
        loaded: file.size,
        total: file.size,
        percent: 100,
        speed: '1 MB/s',
        timeRemaining: '0s',
      });
    } else {
      onProgress({
        loaded: (file.size * progress) / 100,
        total: file.size,
        percent: progress,
        speed: '1 MB/s',
        timeRemaining: `${(100 - progress) / 10}s`,
      });
    }
  }, 100);

  return uploadToIPFS(file);
};

// Mock DocumentPreview component
const DocumentPreview = ({
  file,
  onRemove,
  showRemove = true,
  className,
}: {
  file: File;
  onRemove: () => void;
  showRemove?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 border rounded',
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium">{file.name}</span>
        <span className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </span>
      </div>
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </Button>
      )}
    </div>
  );
};

// 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface DocumentInputProps {
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  description?: string;
  value?: File[] | null;
  onChange: (files: File[] | null) => void;
  onError?: (error: string) => void;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  className?: string;
  autoUpload?: boolean; // If true, automatically upload files when selected
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  id,
  name,
  label,
  hint,
  description,
  value,
  onChange,
  onError,
  required = false,
  multiple = false,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = MAX_FILE_SIZE,
  maxFiles = 5,
  className = '',
  autoUpload = false,
}) => {
  const [files, setFiles] = useState<File[]>(value || []);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    percent: number;
    speed: string;
    timeRemaining: string;
  } | null>(null);
  const [uploadCancel, setUploadCancel] = useState<() => void>(() => () => {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update internal files state when value prop changes
  useEffect(() => {
    if (value) {
      setFiles(value);
    }
  }, [value]);

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      const validTypes = accept
        .split(',')
        .map((type) => type.trim().toLowerCase());
      const fileType = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!validTypes.some((type) => type.endsWith(fileType || ''))) {
        return {
          valid: false,
          error: `Invalid file type. Allowed types: ${accept}`,
        };
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return {
          valid: false,
          error: `File too large. Max size: ${maxSizeMB}MB`,
        };
      }

      return { valid: true };
    },
    [accept, maxSize]
  );

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      // In a real app, you would upload to your server here
      // For now, we'll just simulate an upload with progress
      const file = filesToUpload[0];

      // Simulate upload with progress
      const abortController = new AbortController();

      // Mock upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(progressInterval);
          setUploadProgress({
            percent: 100,
            speed: formatSpeed(1024 * 1024), // 1MB/s
            timeRemaining: '0s',
          });

          // Simulate upload completion
          setTimeout(() => {
            setUploadProgress(null);
            setIsUploading(false);
            // Call the original onChange with the uploaded files
            if (onChange) {
              onChange([...files, ...filesToUpload]);
            }
          }, 500);
        } else {
          setUploadProgress({
            percent: progress,
            speed: formatSpeed((file.size * 0.1) / 1), // Simulate speed
            timeRemaining: `${(100 - progress) / 10}s`,
          });
        }
      }, 200);

      setUploadCancel(() => {
        return () => {
          clearInterval(progressInterval);
          abortController.abort();
        };
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const updateFiles = useCallback(
    (newFiles: File[]) => {
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
      onChange(updatedFiles.length > 0 ? updatedFiles : null);

      // If autoUpload is enabled, start uploading the new files
      if (autoUpload) {
        handleUpload(newFiles);
      }

      return updatedFiles;
    },
    [files, maxFiles, onChange, autoUpload, handleUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  // Clean up uploads on unmount
  useEffect(() => {
    return () => {
      if (uploadCancel) {
        uploadCancel();
      }
    };
  }, [uploadCancel]);

  const handleCancelUpload = () => {
    if (uploadCancel) {
      uploadCancel();
      setUploadProgress(null);
      setIsUploading(false);
      setError('Upload cancelled');
    }
  };

  const processFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      newFiles.forEach((file) => {
        const { valid, error } = validateFile(file);
        if (valid) {
          validFiles.push(file);
        } else if (error) {
          errors.push(error);
        }
      });

      if (errors.length > 0) {
        const errorMessage = errors.join('\n');
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }

      if (validFiles.length > 0) {
        updateFiles(validFiles);
        if (autoUpload) {
          handleUpload(validFiles);
        }
      }
    },
    [autoUpload, handleUpload, onError, updateFiles, validateFile]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!e.dataTransfer?.files?.length) return;

      const files = Array.from(e.dataTransfer.files);

      // Check for invalid files
      const invalidFiles = files.filter((file) => {
        const { valid } = validateFile(file);
        return !valid;
      });

      if (invalidFiles.length > 0) {
        const errorMsg = 'One or more files are invalid';
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
        return;
      }

      onChange(files);
    },
    [onChange, onError]
  );

  const handleRemoveFile = (index: number) => {
    if (isUploading) {
      handleCancelUpload();
      return;
    }

    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    if (onChange) {
      onChange(newFiles.length > 0 ? newFiles : null);
    }
  };

  const renderUploadButton = () => (
    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <div className="flex text-gray-600 justify-center">
          <ArrowUpTrayIcon
            className="h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor={id}
            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Upload a file</span>
            <input
              id={id}
              name={name}
              type="file"
              className="sr-only"
              multiple={multiple}
              accept={accept}
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          {accept ? `Supported formats: ${accept}` : 'Any file type'} up to{' '}
          {maxSize / (1024 * 1024)}MB
        </p>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Uploading...</span>
        <span>{uploadProgress?.percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${uploadProgress?.percent}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{uploadProgress?.speed}</span>
        <span>{uploadProgress?.timeRemaining} remaining</span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCancelUpload}
          className="text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-1 ${isDragging ? 'ring-2 ring-indigo-500' : ''}`}
      >
        {isUploading && uploadProgress
          ? renderProgressBar()
          : renderUploadButton()}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && !isUploading && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}

      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {isUploading ? 'Uploading files...' : 'Selected files:'}
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <DocumentPreview
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                onRemove={() => handleRemoveFile(index)}
                className={`border rounded-md p-2 ${isUploading ? 'opacity-70' : 'bg-gray-50'}`}
                showRemove={!isUploading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
