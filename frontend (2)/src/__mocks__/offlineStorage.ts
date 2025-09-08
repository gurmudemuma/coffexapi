export const isOnline = jest.fn(() => true);
export const getPendingOperations = jest.fn(() => Promise.resolve(false));
export const setOnlineStatus = jest.fn((status: boolean) => {
  isOnline.mockReturnValue(status);
});

export const mockOfflineStorage = {
  isOnline,
  getPendingOperations,
  setOnlineStatus,
};
