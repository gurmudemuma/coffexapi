# Component Documentation Template

Use this template when creating new components to ensure consistent documentation across the project.

## Component Template

```typescript
/**
 * ComponentName
 * 
 * [Brief description of what this component does]
 * 
 * This component provides [detailed explanation of functionality, use cases, and behavior].
 * 
 * ## Features
 * - Feature 1: Description
 * - Feature 2: Description
 * - Feature 3: Description
 * 
 * ## Usage
 * 
 * ### Basic Usage
 * ```tsx
 * <ComponentName 
 *   requiredProp="value"
 *   optionalProp={optionalValue}
 * />
 * ```
 * 
 * ### Advanced Usage
 * ```tsx
 * <ComponentName 
 *   requiredProp="value"
 *   optionalProp={optionalValue}
 *   onEvent={handleEvent}
 *   className="custom-styles"
 * >
 *   <ChildComponent />
 * </ComponentName>
 * ```
 * 
 * ## Accessibility
 * - [List accessibility features and requirements]
 * - Supports keyboard navigation
 * - ARIA labels and roles are properly set
 * - Screen reader compatible
 * 
 * ## Performance
 * - [List performance optimizations]
 * - Uses React.memo for re-render optimization
 * - Expensive calculations are memoized
 * - Event handlers are memoized with useCallback
 * 
 * @example
 * ```tsx
 * // Example 1: Basic usage
 * <ComponentName prop1="value1" />
 * 
 * // Example 2: With event handlers
 * <ComponentName 
 *   prop1="value1"
 *   onAction={(data) => console.log(data)}
 * />
 * 
 * // Example 3: With children
 * <ComponentName prop1="value1">
 *   <p>Child content</p>
 * </ComponentName>
 * ```
 */

import React, { memo, useMemo, useCallback } from 'react';
import { cn } from '../utils';
import type { BaseComponentProps } from '../types';

// ==============================================================================
// Types
// ==============================================================================

/**
 * Props for ComponentName component
 */
export interface ComponentNameProps extends BaseComponentProps {
  /** Required prop description */
  requiredProp: string;
  
  /** Optional prop description */
  optionalProp?: number;
  
  /** Callback function called when event occurs */
  onEvent?: (data: EventData) => void;
  
  /** Controls component state */
  isActive?: boolean;
  
  /** Loading state indicator */
  isLoading?: boolean;
  
  /** Error state message */
  error?: string | null;
}

/**
 * Event data structure
 */
export interface EventData {
  /** Event identifier */
  id: string;
  
  /** Event payload */
  payload: unknown;
  
  /** Event timestamp */
  timestamp: number;
}

// ==============================================================================
// Constants
// ==============================================================================

const DEFAULT_VALUES = {
  optionalProp: 0,
  isActive: false,
  isLoading: false,
} as const;

// ==============================================================================
// Helper Functions
// ==============================================================================

/**
 * Helper function description
 * 
 * @param param - Parameter description
 * @returns Return value description
 */
const helperFunction = (param: string): string => {
  return param.toUpperCase();
};

// ==============================================================================
// Sub-components
// ==============================================================================

/**
 * LoadingState component for displaying loading state
 */
const LoadingState: React.FC = memo(() => (
  <div className="flex items-center justify-center p-4" data-testid="loading-state">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
    <span className="ml-2 text-sm text-gray-600">Loading...</span>
  </div>
));

LoadingState.displayName = 'ComponentName.LoadingState';

/**
 * ErrorState component for displaying error state
 */
interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = memo(({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center" data-testid="error-state">
    <div className="text-red-600 mb-2">⚠️ Error</div>
    <p className="text-sm text-gray-600 mb-3">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    )}
  </div>
));

ErrorState.displayName = 'ComponentName.ErrorState';

// ==============================================================================
// Main Component
// ==============================================================================

/**
 * ComponentName component
 * 
 * [Additional component-specific documentation]
 * 
 * @param props - Component properties
 * @returns React functional component
 */
export const ComponentName: React.FC<ComponentNameProps> = memo(({
  requiredProp,
  optionalProp = DEFAULT_VALUES.optionalProp,
  onEvent,
  isActive = DEFAULT_VALUES.isActive,
  isLoading = DEFAULT_VALUES.isLoading,
  error = null,
  className,
  'data-testid': testId = 'component-name',
  children,
  ...props
}) => {
  // ==============================================================================
  // Memoized Values
  // ==============================================================================
  
  /**
   * Computed value based on props
   */
  const computedValue = useMemo(() => {
    return helperFunction(requiredProp) + optionalProp;
  }, [requiredProp, optionalProp]);
  
  /**
   * CSS classes for the component
   */
  const componentClasses = useMemo(() => cn(
    'base-component-classes',
    'flex items-center justify-between',
    'p-4 rounded-lg border',
    {
      'bg-blue-50 border-blue-200': isActive,
      'bg-gray-50 border-gray-200': !isActive,
      'opacity-50 pointer-events-none': isLoading,
    },
    className
  ), [isActive, isLoading, className]);
  
  // ==============================================================================
  // Memoized Callbacks
  // ==============================================================================
  
  /**
   * Handle click events
   */
  const handleClick = useCallback(() => {
    if (isLoading || error) return;
    
    const eventData: EventData = {
      id: `event-${Date.now()}`,
      payload: { requiredProp, optionalProp, computedValue },
      timestamp: Date.now(),
    };
    
    onEvent?.(eventData);
  }, [isLoading, error, requiredProp, optionalProp, computedValue, onEvent]);
  
  /**
   * Handle retry action for error state
   */
  const handleRetry = useCallback(() => {
    // Reset error state and retry logic
    onEvent?.({
      id: 'retry-event',
      payload: { action: 'retry' },
      timestamp: Date.now(),
    });
  }, [onEvent]);
  
  // ==============================================================================
  // Render
  // ==============================================================================
  
  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }
  
  return (
    <div 
      className={componentClasses}
      onClick={handleClick}
      data-testid={testId}
      role="button"
      tabIndex={0}
      aria-label={`Component with value: ${computedValue}`}
      aria-pressed={isActive}
      {...props}
    >
      {/* Main content */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">
          {requiredProp}
        </h3>
        <p className="text-sm text-gray-600">
          Computed: {computedValue}
        </p>
      </div>
      
      {/* Status indicator */}
      <div className={cn(
        'w-3 h-3 rounded-full',
        isActive ? 'bg-green-500' : 'bg-gray-300'
      )} />
      
      {/* Children content */}
      {children && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
});

// ==============================================================================
// Component Display Name
// ==============================================================================

ComponentName.displayName = 'ComponentName';

// ==============================================================================
// Default Export
// ==============================================================================

export default ComponentName;
```

## JSDoc Standards

### Function Documentation

```typescript
/**
 * Function description
 * 
 * Detailed explanation of what the function does, its purpose,
 * and any important implementation details.
 * 
 * @param param1 - Description of first parameter
 * @param param2 - Description of second parameter
 * @param options - Configuration options
 * @param options.option1 - First option description
 * @param options.option2 - Second option description
 * @returns Description of return value
 * 
 * @throws {Error} When invalid parameters are provided
 * 
 * @example
 * ```typescript
 * const result = functionName('value1', 42, {
 *   option1: true,
 *   option2: 'config'
 * });
 * ```
 * 
 * @see {@link RelatedFunction} for related functionality
 * @since v1.2.0
 */
const functionName = (
  param1: string,
  param2: number,
  options: { option1: boolean; option2: string }
): ReturnType => {
  // Implementation
};
```

### Interface Documentation

```typescript
/**
 * Interface description
 * 
 * Detailed explanation of the interface purpose and usage.
 * 
 * @example
 * ```typescript
 * const config: ConfigInterface = {
 *   setting1: 'value',
 *   setting2: 42,
 *   setting3: true
 * };
 * ```
 */
interface ConfigInterface {
  /** Description of setting1 */
  setting1: string;
  
  /** 
   * Description of setting2
   * 
   * @default 0
   * @minimum 0
   * @maximum 100
   */
  setting2: number;
  
  /** 
   * Description of setting3
   * 
   * @default false
   */
  setting3?: boolean;
}
```

### Hook Documentation

```typescript
/**
 * useCustomHook
 * 
 * Custom hook for managing [specific functionality].
 * Provides [list of features and capabilities].
 * 
 * @param initialValue - Initial state value
 * @param options - Hook configuration options
 * @returns Hook state and methods
 * 
 * @example
 * ```tsx
 * const { value, setValue, reset, isLoading } = useCustomHook('initial', {
 *   autoSave: true,
 *   debounceMs: 300
 * });
 * 
 * // Use in component
 * <input 
 *   value={value} 
 *   onChange={(e) => setValue(e.target.value)} 
 * />
 * ```
 */
export const useCustomHook = (
  initialValue: string,
  options: HookOptions = {}
) => {
  // Hook implementation
};
```

## Documentation Guidelines

### Required Documentation

1. **All exported functions and components**
2. **All public interfaces and types**
3. **Complex business logic**
4. **API integration points**
5. **Custom hooks**

### Documentation Sections

1. **Brief Description**: One-line summary
2. **Detailed Description**: Comprehensive explanation
3. **Parameters**: All parameters with types and descriptions
4. **Returns**: Return value description
5. **Examples**: Code examples showing usage
6. **Notes**: Important implementation details
7. **See Also**: Links to related functionality

### Best Practices

- Use clear, concise language
- Provide practical examples
- Document edge cases and limitations
- Keep documentation up to date with code changes
- Use consistent formatting and style
- Include accessibility and performance notes
- Document error conditions and handling