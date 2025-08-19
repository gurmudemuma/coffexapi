import { api } from '../lib/api';

describe('API Client', () => {
  // Mock the global fetch
  const mockFetch = jest.fn();
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  // Mock XMLHttpRequest
  const originalXMLHttpRequest = global.XMLHttpRequest;
  let mockXHROpen: jest.Mock;
  let mockXHRSend: jest.Mock;
  let mockXHRSetHeader: jest.Mock;
  let onProgressHandler: (event: ProgressEvent) => void = () => {};
  let onLoadHandler: (event: Event) => void = () => {};

  let mockXHR: any;

  // Store original implementations
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };

    // Set up fetch mock
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
      statusText: 'OK',
    });

    // Set up XMLHttpRequest mock
    mockXHROpen = jest.fn();
    mockXHRSend = jest.fn();
    mockXHRSetHeader = jest.fn();

    // Mock localStorage for auth token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'authToken') return 'test-token';
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Create a mock upload object
    const mockUpload = {
      addEventListener: jest.fn(
        (event: string, handler: (event: ProgressEvent) => void) => {
          if (event === 'progress') {
            onProgressHandler = handler;
          }
        }
      ),
    };

    // Create the mock XHR instance
    mockXHR = {
      open: mockXHROpen,
      send: mockXHRSend,
      setRequestHeader: mockXHRSetHeader,
      upload: mockUpload,
      addEventListener: jest.fn(
        (event: string, handler: (event: Event) => void) => {
          if (event === 'load') {
            onLoadHandler = handler;
          }
        }
      ),
      status: 200,
      responseText: '{"success": true}',
    };

    // Mock XMLHttpRequest with all required properties
    const mockXHRInstance = {
      ...mockXHR,
      UNSENT: 0,
      OPENED: 1,
      HEADERS_RECEIVED: 2,
      LOADING: 3,
      DONE: 4,
      readyState: 4,
      status: 200,
      statusText: 'OK',
      response: '{"success": true}',
      responseText: '{"success": true}',
      responseType: 'json',
      responseURL: '',
      withCredentials: false,
      timeout: 0,
      onreadystatechange: null as (() => void) | null,
      onabort: null as (() => void) | null,
      onerror: null as (() => void) | null,
      onload: null as (() => void) | null,
      onloadend: null as (() => void) | null,
      onloadstart: null as (() => void) | null,
      onprogress: null as ((event: ProgressEvent) => void) | null,
      ontimeout: null as (() => void) | null,
      abort: jest.fn(),
      getAllResponseHeaders: jest.fn(() => ''),
      getResponseHeader: jest.fn((header: string) => null),
      overrideMimeType: jest.fn(),
      setRequestHeader: mockXHRSetHeader,
      open: mockXHROpen,
      send: mockXHRSend,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn().mockReturnValue(true),
    };

    // @ts-ignore - Mocking global XMLHttpRequest
    global.XMLHttpRequest = jest.fn(
      () => mockXHRInstance
    ) as unknown as typeof XMLHttpRequest;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    global.XMLHttpRequest = originalXMLHttpRequest;
  });

  describe('request', () => {
    it('should make a successful API request', async () => {
      const testData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => testData,
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const response = await api.request('/test');
      expect(response).toEqual(testData);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Test error';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage }),
        statusText: 'Bad Request',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      await expect(api.request('/error')).rejects.toThrow(errorMessage);
    });
  });

  describe('authentication', () => {
    it('should call login with credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 'test-token' }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      await api.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(credentials),
        })
      );
    });
  });

  describe('file upload', () => {
    it('should upload a file with progress', async () => {
      // Mock localStorage for auth token
      const originalLocalStorage = global.localStorage;
      global.localStorage = {
        ...originalLocalStorage,
        getItem: jest.fn((key: string) => {
          if (key === 'authToken') return 'test-token';
          return null;
        }),
      } as any;

      // Setup test data
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const onProgress = jest.fn();

      // Start the upload
      const uploadPromise = api.uploadDocument(file, onProgress);

      // Simulate progress event
      const progressEvent = new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 50,
        total: 100,
      });
      mockXHR.upload.addEventListener.mock.calls[0][1](progressEvent);
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          loaded: 50,
          total: 100,
          percent: 50,
        })
      );

      // Simulate successful upload
      // @ts-ignore
      onLoadHandler({
        target: { status: 200, responseText: '{"cid":"mock-cid"}' },
      });

      // Wait for the upload to complete
      await uploadPromise;

      // Verify that the correct methods were called on the mock XHR object
      expect(mockXHROpen).toHaveBeenCalledWith(
        'POST',
        'http://localhost:8000/api/documents',
        true
      );
      expect(mockXHRSetHeader).toHaveBeenCalledWith(
        'Authorization',
        'Bearer test-token'
      );
      expect(mockXHRSend).toHaveBeenCalledWith(expect.any(FormData));

      // Restore original localStorage
      global.localStorage = originalLocalStorage;
    });
  });
});
