import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Utility functions for file formatting
const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    default:
      return '📁';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface DocumentPreviewProps {
  file: File;
  onRemove: () => void;
  className?: string;
  showRemove?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  onRemove,
  className = '',
  showRemove = true,
}) => {
  const previewUrl = React.useMemo(() => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  return (
    <div
      className={`relative group bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors ${className}`}
    >
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Remove file"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}

      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full h-32 mb-2 overflow-hidden rounded-md bg-gray-100">
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-contain"
              onLoad={() => URL.revokeObjectURL(previewUrl)}
            />
          </div>
          <div className="w-full text-center">
            <p
              className="text-sm font-medium text-gray-700 truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-3xl">{getFileIcon(file.name)}</div>
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-medium text-gray-700 truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
      )}
    </div>
  );
};