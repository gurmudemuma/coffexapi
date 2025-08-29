# Frontend Development Guide

## Overview

This guide outlines the development standards, patterns, and best practices for the Coffee Export Platform frontend application built with React, TypeScript, and modern tooling.

## 🏗️ Architecture

### Feature-Based Organization

The application follows a feature-based architecture for better maintainability and scalability:

```
src/
├── features/           # Feature-specific code
│   ├── auth/          # Authentication feature
│   ├── exports/       # Export management feature
│   ├── dashboard/     # Dashboard feature
│   └── users/         # User management feature
├── shared/            # Shared code across features
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── testing/       # Testing utilities
└── App.tsx           # Main application component
```

### Key Principles

1. **Feature Isolation**: Each feature should be self-contained with its own components, hooks, and types
2. **Shared Resources**: Common functionality goes in the `shared` directory
3. **Type Safety**: Everything is typed with TypeScript
4. **Testing First**: Comprehensive test coverage with testing utilities
5. **Performance**: Optimized with React patterns (memo, useMemo, useCallback)

## 🧩 Component Development

### Component Structure

All components should follow this structure:

```typescript
/**
 * Component Name
 * 
 * Brief description of what the component does.
 * More detailed explanation if needed.
 * 
 * @example
 * ```tsx
 * <ComponentName 
 *   prop1="value1"
 *   prop2={value2}
 *   onAction={handleAction}
 * />
 * ```
 */

import React, { memo, useMemo, useCallback } from 'react';
import type { BaseComponentProps } from '../shared/types';

// ==============================================================================
// Types
// ==============================================================================

export interface ComponentNameProps extends BaseComponentProps {
  prop1: string;
  prop2?: number;
  onAction?: (data: any) => void;
}

// ==============================================================================
// Component
// ==============================================================================

export const ComponentName: React.FC<ComponentNameProps> = memo(({
  prop1,
  prop2 = 0,
  onAction,
  className,
  'data-testid': testId = 'component-name',
  children,
  ...props
}) => {
  // Memoized values
  const computedValue = useMemo(() => {
    return expensiveCalculation(prop1, prop2);
  }, [prop1, prop2]);

  // Memoized callbacks
  const handleClick = useCallback(() => {
    onAction?.(computedValue);
  }, [onAction, computedValue]);

  return (
    <div 
      className={cn('base-classes', className)}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

### Performance Optimization

#### React.memo
Use `React.memo` for components that don't need to re-render when props haven't changed:

```typescript
export const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Component implementation
});
```

#### useMemo
Use `useMemo` for expensive calculations:

```typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### useCallback
Use `useCallback` for event handlers passed to child components:

```typescript
const handleSubmit = useCallback((formData) => {
  onSubmit(formData);
}, [onSubmit]);
```

## 🎣 Custom Hooks

### Hook Structure

```typescript
/**
 * useCustomHook
 * 
 * Description of what the hook does.
 * 
 * @param param1 - Description of parameter
 * @returns Object with hook state and methods
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCustomHook(params);
 * ```
 */
export const useCustomHook = (param1: string) => {
  const [state, setState] = useState(initialState);
  
  const method = useCallback(() => {
    // Implementation
  }, []);

  return {
    state,
    method,
  };
};
```

### Built-in Hooks

#### useApi
For API calls with loading and error states:

```typescript
const { data, loading, error, execute } = useApi({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
});

// Execute API call
execute(() => api.getExports());
```

#### useDebounce
For debouncing user input:

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm) {
    searchApi(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

#### useLocalStorage
For persistent state:

```typescript
const [userPrefs, setUserPrefs] = useLocalStorage('userPreferences', defaultPrefs);
```

## 🛡️ Error Handling

### Error Boundaries

#### RouteErrorBoundary
For route-level errors:

```typescript
<RouteErrorBoundary>
  <Routes>
    <Route path="/exports" element={<ExportsPage />} />
  </Routes>
</RouteErrorBoundary>
```

#### FeatureErrorBoundary
For individual features:

```typescript
<FeatureErrorBoundary featureName="export-form" compact>
  <ExportForm />
</FeatureErrorBoundary>
```

#### AsyncErrorBoundary
For async operations:

```typescript
<AsyncErrorBoundary>
  <DataFetchingComponent />
</AsyncErrorBoundary>
```

## 🧪 Testing

### Testing Philosophy

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **User-Centric Tests**: Test from the user's perspective
3. **Comprehensive Coverage**: Aim for high test coverage with meaningful tests

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { 
  renderWithProviders, 
  screen, 
  userEvent,
  createBaseComponentTests 
} from '../../shared/testing';

// Generated tests for common behavior
createBaseComponentTests({
  name: 'ComponentName',
  component: ComponentName,
  defaultProps: { prop1: 'test' },
  requiredProps: { prop1: 'required' },
});

// Custom tests for specific behavior
describe('ComponentName - Custom Behavior', () => {
  it('does something specific', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentName prop1="test" />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Expected Result')).toBeInTheDocument();
  });
});
```

### Testing Utilities

#### renderWithProviders
Renders components with all necessary providers:

```typescript
renderWithProviders(<Component />, {
  queryClient: mockQueryClient,
  initialRoute: '/test-route',
});
```

#### Mock Factories
Create consistent mock data:

```typescript
const mockUser = createMockUser({ role: 'admin' });
const mockExport = createMockExport({ status: 'APPROVED' });
```

## 🎨 Styling

### Tailwind CSS Classes

Use Tailwind for styling with consistent patterns:

```typescript
// Layout
'flex items-center justify-between'
'grid grid-cols-1 md:grid-cols-2 gap-4'
'container mx-auto px-4'

// Spacing
'p-4 m-2'           // padding and margin
'space-y-4'         // vertical spacing between children
'gap-4'             // grid/flex gap

// Colors
'bg-white dark:bg-gray-800'
'text-gray-900 dark:text-white'
'border-gray-200 dark:border-gray-700'

// Interactive states
'hover:bg-gray-50 focus:ring-2 focus:ring-blue-500'
'transition-colors duration-200'
```

### Component Variants

Use `class-variance-authority` for component variants:

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

## 📡 API Integration

### API Hook Pattern

```typescript
export const useExports = () => {
  const { data, loading, error, execute } = useApi<Export[]>();
  
  const fetchExports = useCallback(async (filters?: ExportFilters) => {
    await execute(() => api.getExports(filters));
  }, [execute]);
  
  return {
    exports: data || [],
    loading,
    error,
    fetchExports,
  };
};
```

### Error Handling

```typescript
try {
  const response = await api.createExport(exportData);
  if (response.success) {
    // Handle success
  }
} catch (error) {
  // Handle error
  console.error('Export creation failed:', error);
}
```

## 🔧 Development Tools

### Code Quality

- **ESLint**: Linting with React, TypeScript, and accessibility rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vitest**: Unit testing
- **Playwright**: E2E testing

### Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript checks
```

## 📚 Best Practices

### Do's

- ✅ Use TypeScript for type safety
- ✅ Write tests for all components
- ✅ Use semantic HTML elements
- ✅ Implement proper error boundaries
- ✅ Optimize performance with React patterns
- ✅ Follow accessibility guidelines
- ✅ Use consistent naming conventions
- ✅ Document complex logic with JSDoc

### Don'ts

- ❌ Don't use `any` type
- ❌ Don't skip error handling
- ❌ Don't ignore accessibility
- ❌ Don't write tests for implementation details
- ❌ Don't mutate props or state directly
- ❌ Don't use inline styles
- ❌ Don't forget to clean up subscriptions/timers

## 🚀 Performance Considerations

### Bundle Optimization

- Use lazy loading for routes
- Implement code splitting
- Optimize images and assets
- Use React.memo for expensive components
- Debounce user inputs

### Memory Management

- Clean up event listeners
- Cancel ongoing API requests
- Use WeakMap/WeakSet when appropriate
- Avoid memory leaks in useEffect

## 🔍 Debugging

### Development Tools

- React Developer Tools
- Redux DevTools (if using Redux)
- Browser DevTools
- Lighthouse for performance audits

### Logging

```typescript
// Use consistent logging
import { logger } from '../shared/utils/logging';

logger.info('User action', { userId, action });
logger.error('API Error', { error, context });
```

This guide should be updated as the application evolves and new patterns emerge.