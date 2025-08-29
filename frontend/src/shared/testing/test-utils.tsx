/**
 * Test Utilities
 * 
 * Comprehensive testing utilities for React components with all necessary providers.
 * Includes custom render function, mock implementations, and testing helpers.
 */

import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// ==============================================================================
// Mock Data Factory
// ==============================================================================

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'exporter' as const,
  organization: 'Test Org',
  status: 'active' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  permissions: ['export:create', 'export:view'],
  ...overrides,
});

export const createMockExport = (overrides = {}) => ({
  id: '1',
  exportId: 'EXP-001',
  status: 'SUBMITTED' as const,
  submittedAt: Date.now(),
  exporterDetails: {
    companyName: 'Test Company',
    registrationNumber: '12345',
    taxId: 'TAX123',
    contactPerson: 'John Doe',
    email: 'john@testcompany.com',
    phone: '+1234567890',
    address: '123 Test St',
    city: 'Test City',
    country: 'Test Country',
    postalCode: '12345',
  },
  tradeDetails: {
    productName: 'Arabica Coffee',
    productDescription: 'Premium coffee beans',
    quantity: 1000,
    unit: 'kg',
    unitPrice: 5.50,
    totalValue: 5500,
    currency: 'USD',
    countryOfOrigin: 'Ethiopia',
    destinationCountry: 'USA',
    incoterms: 'FOB',
    shippingDate: '2024-02-01',
    expectedDeliveryDate: '2024-02-15',
    paymentTerms: 'L/C at sight',
    paymentMethod: 'Letter of Credit',
  },
  documents: {},
  validationSummary: {
    totalValidations: 4,
    completedValidations: 0,
  },
  ...overrides,
});

export const createMockApiResponse = <T,>(data: T, overrides = {}) => ({
  success: true,
  data,
  message: 'Success',
  timestamp: new Date().toISOString(),
  ...overrides,
});

// ==============================================================================
// Mock Implementations
// ==============================================================================

export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Mock API functions
export const mockApiCall = vi.fn();
export const mockApiGet = vi.fn();
export const mockApiPost = vi.fn();
export const mockApiPut = vi.fn();
export const mockApiDelete = vi.fn();

// ==============================================================================
// Test Providers
// ==============================================================================

interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  initialRoute?: string;
}

const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient,
  initialRoute = '/',
}) => {
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// ==============================================================================
// Custom Render Function
// ==============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialRoute?: string;
  wrapper?: React.ComponentType<any>;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    queryClient,
    initialRoute,
    wrapper: Wrapper,
    ...renderOptions
  } = options;

  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const content = (
      <TestProviders queryClient={queryClient} initialRoute={initialRoute}>
        {children}
      </TestProviders>
    );

    return Wrapper ? <Wrapper>{content}</Wrapper> : content;
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

// ==============================================================================
// Test Helpers
// ==============================================================================

/**
 * Wait for loading states to complete
 */
export const waitForLoadingToFinish = async () => {
  const { findByTestId } = await import('@testing-library/react');
  // Wait for any loading spinners to disappear
  try {
    await findByTestId('loading-spinner');
    // If found, wait for it to disappear
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch {
    // Loading spinner not found, which is good
  }
};

/**
 * Simulate user typing with delay
 */
export const typeWithDelay = async (element: Element, text: string, delay = 50) => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup({ delay });
  await user.type(element, text);
};

/**
 * Simulate file upload
 */
export const uploadFile = async (input: Element, file: File) => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.upload(input, file);
};

/**
 * Create a mock file for testing
 */
export const createMockFile = (
  name = 'test.pdf',
  content = 'test content',
  type = 'application/pdf'
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

/**
 * Assert element has accessible name
 */
export const expectAccessibleName = (element: Element, name: string) => {
  const { getByRole } = require('@testing-library/react');
  expect(element).toBeInTheDocument();
  expect(element).toHaveAccessibleName(name);
};

/**
 * Mock window.fetch for API testing
 */
export const mockFetch = (response: any, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

// ==============================================================================
// Test Cleanup
// ==============================================================================

export const cleanupMocks = () => {
  vi.clearAllMocks();
  mockNavigate.mockClear();
  mockApiCall.mockClear();
  mockApiGet.mockClear();
  mockApiPost.mockClear();
  mockApiPut.mockClear();
  mockApiDelete.mockClear();
};

// ==============================================================================
// Custom Matchers
// ==============================================================================

expect.extend({
  toBeLoading(received) {
    const pass = received.getAttribute('data-testid') === 'loading-spinner' ||
                 received.classList.contains('animate-spin') ||
                 received.textContent?.includes('Loading');
    
    return {
      message: () => 
        pass
          ? `Expected element not to be loading`
          : `Expected element to be loading`,
      pass,
    };
  },
});

// ==============================================================================
// Re-exports
// ==============================================================================

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi } from 'vitest';
