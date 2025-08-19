import { api } from '../api';

// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Client', () => {
  const mockResponse = (
    status: number,
    data: any,
    ok = status >= 200 && status < 300
  ) => {
    return Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  };

  beforeEach(() => {
    mockFetch.mockClear();
    localStorageMock.clear();
  });

  describe('request', () => {
    it('should make a GET request with default headers', async () => {
      const testData = { message: 'Success' };
      mockFetch.mockResolvedValueOnce(mockResponse(200, testData));

      const response = await api.request('/test');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/test', {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        credentials: 'include',
      });
      expect(response).toEqual(testData);
    });

    it('should include auth token in headers when available', async () => {
      const token = 'test-token';
      localStorageMock.setItem('authToken', token);

      mockFetch.mockResolvedValueOnce(mockResponse(200, {}));

      await api.request('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/protected',
        {
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          credentials: 'include',
        }
      );
    });

    it('should handle non-JSON responses', async () => {
      const textResponse = 'Plain text response';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(textResponse),
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      });

      const response = await api.request('/text-endpoint');
      expect(response).toBe(textResponse);
    });
  });

  describe('login', () => {
    it('should make a POST request with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const responseData = {
        token: 'test-token',
        user: { id: 1, email: credentials.email },
      };

      mockFetch.mockResolvedValueOnce(mockResponse(200, responseData));

      const response = await api.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/login',
        {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(credentials),
          credentials: 'include',
        }
      );

      expect(response).toEqual(responseData);
    });
  });

  describe('error handling', () => {
    it('should throw an error with status and data for failed requests', async () => {
      const errorData = { message: 'Invalid credentials', code: 'AUTH_ERROR' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve(errorData),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      await expect(api.request('/failing-endpoint')).rejects.toMatchObject({
        message: 'Invalid credentials',
        status: 401,
        data: errorData,
      });
    });
  });
});
