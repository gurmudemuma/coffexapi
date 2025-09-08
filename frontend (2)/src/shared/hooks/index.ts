// Shared hooks exports
export { default as useApi } from './useApi';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useDebounce } from './useDebounce';

// Re-export existing hooks from main hooks directory
export { useOfflineStatus } from '../../hooks/useOfflineStatus';