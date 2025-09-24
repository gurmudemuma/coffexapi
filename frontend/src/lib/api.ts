/**
 * API client for making HTTP requests
 */

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

function setAuthToken(token: string) {
  try {
    localStorage.setItem('authToken', token);
  } catch {}
}

function getAuthToken() {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
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
    // Avoid cross-origin cookies to prevent CORS credential errors
    // credentials: 'include',
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
  }) => void,
  extraFields?: Record<string, string | boolean | number>
): Promise<any> {
  const formData = new FormData();
  formData.append(fieldName, file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => {
      formData.append(k, String(v));
    });
  }

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

async function login(username: string, password: string) {
  const response = await request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
}

async function register(data: any) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}

async function getOrganizationSummary(orgId: string) {
  return request(`/summary/${orgId}`);
}

async function submitExport(data: any) {
  return request('/export', { method: 'POST', body: JSON.stringify(data) });
}

async function getExporterDashboard() {
  return request('/export/dashboard');
}

async function getExporterRequests() {
  return request('/export/requests');
}

async function getExporterRequestDetail(id: string) {
  return request(`/export/requests/${id}`);
}

async function getBankSupervisorExports() {
  return request('/bank/exports');
}

async function getBankSupervisorView(id: string) {
  return request(`/bank/exports/${id}`);
}

async function submitApprovalDecision(data: any) {
  return request('/approval', { method: 'POST', body: JSON.stringify(data) });
}

async function getCompletedApprovals() {
  return request('/approval/completed');
}

async function searchDocuments(query: string) {
  return request(`/documents/search?q=${query}`);
}

async function getActivityLog() {
  return request('/activity');
}

async function viewDocument(id: string) {
  return request(`/documents/${id}`);
}

async function getApprovalChain(id: string) {
  return request(`/approval/chain/${id}`);
}

const api = {
  login,
  register,
  getOrganizationSummary,
  submitExport,
  getExporterDashboard,
  getExporterRequests,
  getExporterRequestDetail,
  getBankSupervisorExports,
  getBankSupervisorView,
  submitApprovalDecision,
  getCompletedApprovals,
  searchDocuments,
  getActivityLog,
  viewDocument,
  getApprovalChain,
};

export default api;
