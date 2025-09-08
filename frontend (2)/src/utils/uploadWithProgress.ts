export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
  speed: number; // bytes per second
  timeRemaining: number; // in seconds
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (response: any) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
}

/**
 * Uploads a file with progress tracking
 * @param url The URL to upload to
 * @param file The file to upload
 * @param fieldName The form field name (default: 'file')
 * @param options Upload options including progress/complete/error callbacks
 * @returns An object with an abort function to cancel the upload
 */
export const uploadWithProgress = (
  url: string,
  file: File,
  fieldName: string = 'file',
  options: UploadOptions = {}
): { abort: () => void } => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append(fieldName, file);

  let uploadStartTime: number;
  let lastLoaded = 0;
  let lastTime = 0;

  // Set up progress tracking
  xhr.upload.addEventListener('progress', (event) => {
    if (!uploadStartTime) {
      uploadStartTime = Date.now();
      lastTime = uploadStartTime;
      lastLoaded = event.loaded;
      return;
    }

    if (!event.lengthComputable) return;

    const currentTime = Date.now();
    const timeDiff = (currentTime - lastTime) / 1000; // in seconds
    const loadedDiff = event.loaded - lastLoaded;

    // Calculate speed (bytes per second)
    const speed = timeDiff > 0 ? loadedDiff / timeDiff : 0;

    // Calculate remaining time (in seconds)
    const remainingBytes = event.total - event.loaded;
    const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

    if (options.onProgress) {
      options.onProgress({
        loaded: event.loaded,
        total: event.total,
        percent: Math.round((event.loaded / event.total) * 100),
        speed,
        timeRemaining: Math.round(timeRemaining),
      });
    }

    lastLoaded = event.loaded;
    lastTime = currentTime;
  });

  // Set up load handler
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        if (options.onComplete) {
          options.onComplete(response);
        }
      } catch (error) {
        if (options.onError) {
          options.onError(
            error instanceof Error
              ? error
              : new Error('Invalid response from server')
          );
        }
      }
    } else {
      if (options.onError) {
        options.onError(new Error(`Upload failed with status ${xhr.status}`));
      }
    }
  });

  // Set up error handler
  xhr.addEventListener('error', () => {
    if (options.onError) {
      options.onError(new Error('Network error during upload'));
    }
  });

  // Set up abort handler
  xhr.addEventListener('abort', () => {
    if (options.onError) {
      options.onError(new Error('Upload cancelled'));
    }
  });

  // Open and send the request
  xhr.open('POST', url, true);

  // Set headers if provided
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
  }

  // Add auth token if available
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  }

  xhr.send(formData);

  // Return abort function
  return {
    abort: () => xhr.abort(),
  };
};

// Helper function to format upload speed
const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond.toFixed(0)} B/s`;
  } else if (bytesPerSecond < 1024 * 1024) {
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  } else {
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  }
};

// Helper function to format time remaining
const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.ceil(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

export { formatSpeed, formatTimeRemaining };
