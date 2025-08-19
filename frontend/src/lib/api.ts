/**
 * API client for making HTTP requests
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function setAuthToken(token: string) {
  document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
}

function getAuthToken() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken') {
      return value;
    }
  }
  return null;
}

/**
 * Makes an API request
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Set default headers
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json().catch(() => ({}));
      } catch {
        errorData = { message: response.statusText };
      }

      const error = new Error(errorData.message || 'An error occurred');
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null as any;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    // If the response is not JSON, return as text but cast to T
    // This is a safe assumption since the caller is expecting a specific type
    return response.text() as unknown as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Upload a file with progress tracking
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percent: number;
  }) => void
): Promise<any> {
  const formData = new FormData();
  formData.append(fieldName, file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        let error;
        try {
          const errorData = JSON.parse(xhr.responseText);
          error = new Error(errorData.message || 'Upload failed');
          (error as any).status = xhr.status;
          (error as any).data = errorData;
        } catch {
          error = new Error(`Upload failed with status ${xhr.status}`);
        }
        reject(error);
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open(
      'POST',
      endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`,
      true
    );

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
}

// Export API methods
export const api = {
  // Base request method
  request: request,
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const response = await request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  // Documents
  uploadDocument: (file: File, onProgress?: (progress: any) => void) =>
    uploadFile('/documents', file, 'file', onProgress),

  // Export submissions
  submitExport: (data: any) =>
    request('/exports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Add more API methods as needed
};

export default api;
