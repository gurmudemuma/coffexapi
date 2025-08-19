import { useState, useEffect } from 'react';
import { isOnline, getPendingOperations } from '../utils/offlineStorage';

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [pendingOperations, setPendingOperations] = useState(0);

  // Check for pending operations when the hook mounts
  useEffect(() => {
    const checkPendingOperations = async () => {
      const hasPending = await getPendingOperations();
      setPendingOperations(hasPending ? 1 : 0);
    };

    checkPendingOperations();
  }, []);

  // Set up online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Check for pending operations when coming back online
      getPendingOperations().then((hasPending) => {
        setPendingOperations(hasPending ? 1 : 0);
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!isOnline());

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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
