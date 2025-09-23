
import React from 'react';
import { Bell, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardNotification {
  id: string;
  type: 'APPROVAL' | 'REJECTION' | 'UPDATE';
  exportId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface NotificationsPanelProps {
  notifications: DashboardNotification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  return (
    <Card className="border-purple-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-black">
          <Bell className="w-5 h-5 mr-2 text-purple-600" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} 
                   className={`p-4 rounded-lg border ${notification.isRead ? 'bg-purple-50 border-purple-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-black">{notification.title}</h4>
                      <Badge variant="outline" className="border-purple-200 text-purple-600">
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-purple-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-purple-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">No notifications</h3>
            <p className="text-purple-600">You're all caught up! New notifications will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
