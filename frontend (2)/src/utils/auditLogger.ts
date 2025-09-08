/**
 * Audit Logger Utility
 * 
 * Tracks security-related events, access violations, and user activities
 * for compliance and security monitoring purposes.
 */

interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: 'ACCESS_DENIED' | 'UNAUTHORIZED_ACCESS' | 'PERMISSION_VIOLATION' | 'ORGANIZATION_VIOLATION' | 'ROLE_VIOLATION' | 'LOGIN_ATTEMPT' | 'LOGOUT' | 'SESSION_EXPIRED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  userName?: string;
  userRole?: string;
  userOrganization?: string;
  resourcePath: string;
  description: string;
  metadata?: Record<string, any>;
  userAgent: string;
  ipAddress?: string;
}

interface AuditLogger {
  logEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userAgent'>) => void;
  getEvents: (filters?: Partial<AuditEvent>) => AuditEvent[];
  clearEvents: () => void;
  exportEvents: () => string;
}

class AuditLoggerImpl implements AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  private getIPAddress(): Promise<string> {
    // In a real application, you might get this from a service
    // For now, we'll use a placeholder
    return Promise.resolve('Unknown');
  }

  logEvent(eventData: Omit<AuditEvent, 'id' | 'timestamp' | 'userAgent'>): void {
    const event: AuditEvent = {
      ...eventData,
      id: this.generateId(),
      timestamp: Date.now(),
      userAgent: this.getUserAgent(),
    };

    // Add to events array
    this.events.unshift(event);

    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Persist to localStorage for client-side storage
    try {
      localStorage.setItem('audit_events', JSON.stringify(this.events.slice(0, 100))); // Store only 100 most recent
    } catch (error) {
      console.warn('Failed to persist audit events to localStorage:', error);
    }

    // Log to console for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Audit Event: ${event.eventType}`);
      console.log('Event ID:', event.id);
      console.log('Severity:', event.severity);
      console.log('User:', event.userName, `(${event.userRole})`);
      console.log('Organization:', event.userOrganization);
      console.log('Resource:', event.resourcePath);
      console.log('Description:', event.description);
      if (event.metadata) {
        console.log('Metadata:', event.metadata);
      }
      console.groupEnd();
    }

    // Send to monitoring service (if configured)
    this.sendToMonitoringService(event);
  }

  private async sendToMonitoringService(event: AuditEvent): Promise<void> {
    // In a production environment, send high-severity events to monitoring service
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      try {
        // Example API call to security monitoring service
        // await fetch('/api/security/audit', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
        
        // For now, just console log critical events
        console.error('🚨 SECURITY ALERT:', event);
      } catch (error) {
        console.error('Failed to send audit event to monitoring service:', error);
      }
    }
  }

  getEvents(filters?: Partial<AuditEvent>): AuditEvent[] {
    if (!filters) return [...this.events];

    return this.events.filter(event => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined) return true;
        return event[key as keyof AuditEvent] === value;
      });
    });
  }

  clearEvents(): void {
    this.events = [];
    try {
      localStorage.removeItem('audit_events');
    } catch (error) {
      console.warn('Failed to clear audit events from localStorage:', error);
    }
  }

  exportEvents(): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      eventCount: this.events.length,
      events: this.events
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Load events from localStorage on initialization
  loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('audit_events');
      if (stored) {
        const storedEvents = JSON.parse(stored) as AuditEvent[];
        this.events = storedEvents;
      }
    } catch (error) {
      console.warn('Failed to load stored audit events:', error);
    }
  }
}

// Singleton instance
const auditLogger = new AuditLoggerImpl();

// Load stored events on module initialization
auditLogger.loadStoredEvents();

// Helper functions for common audit scenarios
export const logAccessDenied = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string,
  resourcePath: string,
  reason: string,
  metadata?: Record<string, any>
) => {
  auditLogger.logEvent({
    eventType: 'ACCESS_DENIED',
    severity: 'MEDIUM',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath,
    description: `Access denied: ${reason}`,
    metadata
  });
};

export const logOrganizationViolation = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string,
  attemptedResource: string,
  allowedOrganizations: string[]
) => {
  auditLogger.logEvent({
    eventType: 'ORGANIZATION_VIOLATION',
    severity: 'HIGH',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath: attemptedResource,
    description: `Organization boundary violation: User from "${userOrganization}" attempted to access resource restricted to: ${allowedOrganizations.join(', ')}`,
    metadata: {
      allowedOrganizations,
      violationType: 'organization_boundary'
    }
  });
};

export const logRoleViolation = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string,
  attemptedResource: string,
  allowedRoles: string[]
) => {
  auditLogger.logEvent({
    eventType: 'ROLE_VIOLATION',
    severity: 'HIGH',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath: attemptedResource,
    description: `Role violation: User with role "${userRole}" attempted to access resource restricted to: ${allowedRoles.join(', ')}`,
    metadata: {
      allowedRoles,
      violationType: 'role_restriction'
    }
  });
};

export const logPermissionViolation = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string,
  attemptedResource: string,
  requiredPermissions: string[],
  userPermissions: string[]
) => {
  auditLogger.logEvent({
    eventType: 'PERMISSION_VIOLATION',
    severity: 'MEDIUM',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath: attemptedResource,
    description: `Permission violation: User lacks required permissions for resource access`,
    metadata: {
      requiredPermissions,
      userPermissions,
      missingPermissions: requiredPermissions.filter(p => !userPermissions.includes(p)),
      violationType: 'insufficient_permissions'
    }
  });
};

export const logSuccessfulLogin = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string
) => {
  auditLogger.logEvent({
    eventType: 'LOGIN_ATTEMPT',
    severity: 'LOW',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath: '/login',
    description: `Successful login`,
    metadata: {
      success: true
    }
  });
};

export const logFailedLogin = (
  attemptedUsername: string,
  reason: string
) => {
  auditLogger.logEvent({
    eventType: 'LOGIN_ATTEMPT',
    severity: 'MEDIUM',
    resourcePath: '/login',
    description: `Failed login attempt for username: ${attemptedUsername}`,
    metadata: {
      success: false,
      attemptedUsername,
      failureReason: reason
    }
  });
};

export const logLogout = (
  userId: string,
  userName: string,
  userRole: string,
  userOrganization: string
) => {
  auditLogger.logEvent({
    eventType: 'LOGOUT',
    severity: 'LOW',
    userId,
    userName,
    userRole,
    userOrganization,
    resourcePath: '/logout',
    description: `User logged out`
  });
};

// Export the main logger instance
export default auditLogger;

// Export types for use in other modules
export type { AuditEvent, AuditLogger };