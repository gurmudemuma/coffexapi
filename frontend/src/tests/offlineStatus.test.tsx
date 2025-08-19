import { renderHook, act } from '@testing-library/react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { isOnline, getPendingOperations } from '../utils/offlineStorage';

// Mock the offlineStorage module
jest.mock('../utils/offlineStorage');

describe('useOfflineStatus Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to online
    (isOnline as jest.Mock).mockReturnValue(true);
    (getPendingOperations as jest.Mock).mockResolvedValue(false);
  });

  it('should be online by default', async () => {
    let result: any;
    await act(async () => {
      result = renderHook(() => useOfflineStatus()).result;
    });
    expect(result.current.isOffline).toBe(false);
  });

  it('should detect offline status', async () => {
    let result: any;
    await act(async () => {
      result = renderHook(() => useOfflineStatus()).result;
    });

    // Simulate going offline
    await act(async () => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOffline).toBe(true);
  });

  it('should detect online status', async () => {
    // Start offline
    (isOnline as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useOfflineStatus());

    // Simulate coming back online
    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOffline).toBe(false);
  });
});
