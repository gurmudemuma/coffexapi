import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (type: NotificationType, title: string, message: string, action?: Notification['action']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with some mock notifications for coffee export activities
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'New Export Request',
        message: 'Coffee export request CE-2024-001 submitted for validation',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
      },
      {
        id: '2',
        type: 'warning',
        title: 'Compliance Alert',
        message: 'Export license EL-2024-045 expires in 7 days',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
      },
      {
        id: '3',
        type: 'success',
        title: 'Validation Completed',
        message: 'Quality certificate QC-2024-032 approved successfully',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    action?: Notification['action']
  ) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      action,
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast notification
    const toastMessage = `${title}: ${message}`;
    switch (type) {
      case 'success':
        toast.success(toastMessage);
        break;
      case 'error':
        toast.error(toastMessage);
        break;
      case 'warning':
        toast.warning(toastMessage);
        break;
      case 'info':
      default:
        toast.info(toastMessage);
        break;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate real-time notifications for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'info' as NotificationType,
          title: 'Document Upload',
          message: 'New shipping document uploaded for review',
        },
        {
          type: 'warning' as NotificationType,
          title: 'Validation Pending',
          message: 'Invoice validation required for export CE-2024-' + Math.floor(Math.random() * 1000),
        },
        {
          type: 'success' as NotificationType,
          title: 'Payment Processed',
          message: 'SWIFT payment confirmation received',
        },
        {
          type: 'error' as NotificationType,
          title: 'Validation Failed',
          message: 'Quality certificate rejected - insufficient documentation',
        },
      ];

      // 30% chance to show a notification every 30 seconds
      if (Math.random() < 0.3) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        showNotification(
          randomNotification.type,
          randomNotification.title,
          randomNotification.message
        );
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};