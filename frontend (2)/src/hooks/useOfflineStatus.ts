import { useState, useEffect } from 'react';
import { isOnline, getPendingOperations } from '../utils/offlineStorage';

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [pendingOperations, setPendingOperations] = useState(0);

  // Check for pending operations when the hook mounts and set up online/offline event listeners
  useEffect(() => {
    const updatePendingStatus = async () => {
      const hasPending = await getPendingOperations();
      setPendingOperations(hasPending ? 1 : 0);
    };

    const handleOnline = () => {
      setIsOffline(false);
      updatePendingStatus();
    };

    // Initial check and setup
    updatePendingStatus();
    setIsOffline(!isOnline());

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', () => setIsOffline(true));

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', () => setIsOffline(true));
    };
  }, []);

  // Function to update pending operations count
  const updatePendingOperations = async () => {
    const hasPending = await getPendingOperations();
    setPendingOperations(hasPending ? 1 : 0);
  };

  return {
    isOffline,
    hasPendingOperations: pendingOperations > 0,
    pendingOperationsCount: pendingOperations,
    updatePendingOperations,
  };
};
