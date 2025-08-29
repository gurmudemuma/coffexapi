/**
 * Audit Logger Tests
 * 
 * Tests for the comprehensive audit logging system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import auditLogger, {
  logAccessDenied,
  logOrganizationViolation,
  logRoleViolation,
  logPermissionViolation,
  logSuccessfulLogin,
  logFailedLogin,
  logLogout,
  type AuditEvent,
} from '../../utils/auditLogger';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock console methods
const originalConsole = global.console;
const mockConsole = {
  ...originalConsole,
  warn: vi.fn(),
  error: vi.fn(),
  group: vi.fn(),
  groupEnd: vi.fn(),
  log: vi.fn(),
};

// Mock navigator.userAgent
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Test Browser) Test/1.0',
};
Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('AuditLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    global.console = mockConsole;
    auditLogger.clearEvents();
    
    // Set NODE_ENV to development for console logging tests
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.console = originalConsole;
    vi.unstubAllEnvs();
  });

  describe('Basic Event Logging', () => {
    it('should log a basic audit event', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        userId: 'user-123',
        userName: 'Test User',
        userRole: 'USER',
        userOrganization: 'Test Org',
        resourcePath: '/test-resource',
        description: 'Test access denied',
      });

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        userId: 'user-123',
        userName: 'Test User',
        userRole: 'USER',
        userOrganization: 'Test Org',
        resourcePath: '/test-resource',
        description: 'Test access denied',
        userAgent: 'Mozilla/5.0 (Test Browser) Test/1.0',
      });

      expect(event.id).toMatch(/^audit-\d+-[a-z0-9]+$/);
      expect(event.timestamp).toBeTypeOf('number');
      expect(event.timestamp).toBeCloseTo(Date.now(), -2);
    });

    it('should generate unique IDs for each event', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'LOW',
        resourcePath: '/test1',
        description: 'Test 1',
      });

      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'LOW',
        resourcePath: '/test2',
        description: 'Test 2',
      });

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(2);
      expect(events[0].id).not.toBe(events[1].id);
    });

    it('should maintain event order (newest first)', () => {
      auditLogger.logEvent({
        eventType: 'LOGIN_ATTEMPT',
        severity: 'LOW',
        resourcePath: '/login',
        description: 'First event',
      });

      // Wait a bit to ensure different timestamps
      const secondEventTime = Date.now() + 1;
      vi.setSystemTime(secondEventTime);

      auditLogger.logEvent({
        eventType: 'LOGOUT',
        severity: 'LOW',
        resourcePath: '/logout',
        description: 'Second event',
      });

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(2);
      expect(events[0].description).toBe('Second event');
      expect(events[1].description).toBe('First event');
    });
  });

  describe('Event Type Logging Functions', () => {
    it('should log access denied events', () => {
      logAccessDenied(
        'user-123',
        'Test User',
        'USER_ROLE',
        'Test Org',
        '/protected-resource',
        'Insufficient permissions',
        { additionalInfo: 'test' }
      );

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        userId: 'user-123',
        userName: 'Test User',
        userRole: 'USER_ROLE',
        userOrganization: 'Test Org',
        resourcePath: '/protected-resource',
        description: 'Access denied: Insufficient permissions',
        metadata: { additionalInfo: 'test' },
      });
    });

    it('should log organization violations', () => {
      logOrganizationViolation(
        'user-456',
        'Jane Doe',
        'ADMIN',
        'Wrong Org',
        '/other-org-dashboard',
        ['Correct Org']
      );

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'ORGANIZATION_VIOLATION',
        severity: 'HIGH',
        userId: 'user-456',
        userName: 'Jane Doe',
        userRole: 'ADMIN',
        userOrganization: 'Wrong Org',
        resourcePath: '/other-org-dashboard',
        description: 'Organization boundary violation: User from "Wrong Org" attempted to access resource restricted to: Correct Org',
        metadata: {
          allowedOrganizations: ['Correct Org'],
          violationType: 'organization_boundary',
        },
      });
    });

    it('should log role violations', () => {
      logRoleViolation(
        'user-789',
        'John Smith',
        'USER',
        'Test Org',
        '/admin-panel',
        ['ADMIN', 'SUPER_ADMIN']
      );

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'ROLE_VIOLATION',
        severity: 'HIGH',
        description: 'Role violation: User with role "USER" attempted to access resource restricted to: ADMIN, SUPER_ADMIN',
        metadata: {
          allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
          violationType: 'role_restriction',
        },
      });
    });

    it('should log permission violations', () => {
      logPermissionViolation(
        'user-101',
        'Bob Wilson',
        'USER',
        'Test Org',
        '/sensitive-data',
        ['data:read', 'data:write'],
        ['basic:read']
      );

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'PERMISSION_VIOLATION',
        severity: 'MEDIUM',
        description: 'Permission violation: User lacks required permissions for resource access',
        metadata: {
          requiredPermissions: ['data:read', 'data:write'],
          userPermissions: ['basic:read'],
          missingPermissions: ['data:read', 'data:write'],
          violationType: 'insufficient_permissions',
        },
      });
    });

    it('should log successful login', () => {
      logSuccessfulLogin('user-202', 'Alice Brown', 'ADMIN', 'Main Org');

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'LOGIN_ATTEMPT',
        severity: 'LOW',
        resourcePath: '/login',
        description: 'Successful login',
        metadata: { success: true },
      });
    });

    it('should log failed login', () => {
      logFailedLogin('wrong.user', 'Invalid credentials');

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'LOGIN_ATTEMPT',
        severity: 'MEDIUM',
        resourcePath: '/login',
        description: 'Failed login attempt for username: wrong.user',
        metadata: {
          success: false,
          attemptedUsername: 'wrong.user',
          failureReason: 'Invalid credentials',
        },
      });
    });

    it('should log logout', () => {
      logLogout('user-303', 'Charlie Davis', 'USER', 'Test Org');

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);

      const event = events[0];
      expect(event).toMatchObject({
        eventType: 'LOGOUT',
        severity: 'LOW',
        resourcePath: '/logout',
        description: 'User logged out',
      });
    });
  });

  describe('Event Storage and Retrieval', () => {
    it('should limit the number of stored events', () => {
      // Create more than 1000 events (the default limit)
      for (let i = 0; i < 1005; i++) {
        auditLogger.logEvent({
          eventType: 'ACCESS_DENIED',
          severity: 'LOW',
          resourcePath: `/test-${i}`,
          description: `Test event ${i}`,
        });
      }

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1000);
      expect(events[0].description).toBe('Test event 1004'); // Most recent
    });

    it('should filter events by criteria', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'HIGH',
        userId: 'user-1',
        resourcePath: '/test1',
        description: 'High severity event',
      });

      auditLogger.logEvent({
        eventType: 'LOGIN_ATTEMPT',
        severity: 'LOW',
        userId: 'user-2',
        resourcePath: '/login',
        description: 'Low severity event',
      });

      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        userId: 'user-1',
        resourcePath: '/test2',
        description: 'Medium severity event',
      });

      // Filter by event type
      const accessDeniedEvents = auditLogger.getEvents({ eventType: 'ACCESS_DENIED' });
      expect(accessDeniedEvents).toHaveLength(2);

      // Filter by severity
      const highSeverityEvents = auditLogger.getEvents({ severity: 'HIGH' });
      expect(highSeverityEvents).toHaveLength(1);
      expect(highSeverityEvents[0].description).toBe('High severity event');

      // Filter by user ID
      const user1Events = auditLogger.getEvents({ userId: 'user-1' });
      expect(user1Events).toHaveLength(2);
    });

    it('should clear all events', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'LOW',
        resourcePath: '/test',
        description: 'Test event',
      });

      expect(auditLogger.getEvents()).toHaveLength(1);

      auditLogger.clearEvents();

      expect(auditLogger.getEvents()).toHaveLength(0);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('audit_events');
    });
  });

  describe('localStorage Integration', () => {
    it('should persist events to localStorage', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        resourcePath: '/test',
        description: 'Test event for persistence',
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'audit_events',
        expect.stringContaining('Test event for persistence')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw an error
      expect(() => {
        auditLogger.logEvent({
          eventType: 'ACCESS_DENIED',
          severity: 'LOW',
          resourcePath: '/test',
          description: 'Test event',
        });
      }).not.toThrow();

      expect(mockConsole.warn).toHaveBeenCalledWith(
        'Failed to persist audit events to localStorage:',
        expect.any(Error)
      );
    });

    it('should load stored events on initialization', () => {
      const storedEvents = [
        {
          id: 'test-event-1',
          timestamp: Date.now(),
          eventType: 'ACCESS_DENIED' as const,
          severity: 'LOW' as const,
          resourcePath: '/stored-test',
          description: 'Stored test event',
          userAgent: 'Test Agent',
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedEvents));

      // Simulate loading stored events
      auditLogger.loadStoredEvents();

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].description).toBe('Stored test event');
    });

    it('should handle invalid stored events gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      // Should not throw an error
      expect(() => {
        auditLogger.loadStoredEvents();
      }).not.toThrow();

      expect(mockConsole.warn).toHaveBeenCalledWith(
        'Failed to load stored audit events:',
        expect.any(Error)
      );
    });
  });

  describe('Export Functionality', () => {
    it('should export events as JSON', () => {
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        resourcePath: '/export-test',
        description: 'Event for export test',
      });

      const exportData = auditLogger.exportEvents();
      const parsed = JSON.parse(exportData);

      expect(parsed).toHaveProperty('exportedAt');
      expect(parsed).toHaveProperty('eventCount', 1);
      expect(parsed).toHaveProperty('events');
      expect(parsed.events).toHaveLength(1);
      expect(parsed.events[0]).toMatchObject({
        eventType: 'ACCESS_DENIED',
        description: 'Event for export test',
      });
    });

    it('should include export metadata', () => {
      const exportData = auditLogger.exportEvents();
      const parsed = JSON.parse(exportData);

      expect(parsed.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(typeof parsed.eventCount).toBe('number');
    });
  });

  describe('Development Logging', () => {
    it('should log to console in development mode', () => {
      vi.stubEnv('NODE_ENV', 'development');

      auditLogger.logEvent({
        eventType: 'ORGANIZATION_VIOLATION',
        severity: 'HIGH',
        userId: 'user-123',
        userName: 'Test User',
        userRole: 'USER',
        userOrganization: 'Test Org',
        resourcePath: '/test',
        description: 'Test violation',
        metadata: { test: 'data' },
      });

      expect(mockConsole.group).toHaveBeenCalledWith('🔍 Audit Event: ORGANIZATION_VIOLATION');
      expect(mockConsole.log).toHaveBeenCalledWith('Severity:', 'HIGH');
      expect(mockConsole.log).toHaveBeenCalledWith('User:', 'Test User', '(USER)');
      expect(mockConsole.log).toHaveBeenCalledWith('Organization:', 'Test Org');
      expect(mockConsole.log).toHaveBeenCalledWith('Resource:', '/test');
      expect(mockConsole.log).toHaveBeenCalledWith('Description:', 'Test violation');
      expect(mockConsole.log).toHaveBeenCalledWith('Metadata:', { test: 'data' });
      expect(mockConsole.groupEnd).toHaveBeenCalled();
    });

    it('should not log to console in production mode', () => {
      vi.stubEnv('NODE_ENV', 'production');

      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'MEDIUM',
        resourcePath: '/test',
        description: 'Test event',
      });

      expect(mockConsole.group).not.toHaveBeenCalled();
      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });

  describe('Critical Event Handling', () => {
    it('should trigger special handling for critical events', () => {
      auditLogger.logEvent({
        eventType: 'ORGANIZATION_VIOLATION',
        severity: 'CRITICAL',
        resourcePath: '/critical-resource',
        description: 'Critical security violation',
      });

      expect(mockConsole.error).toHaveBeenCalledWith(
        '🚨 SECURITY ALERT:',
        expect.objectContaining({
          severity: 'CRITICAL',
          description: 'Critical security violation',
        })
      );
    });

    it('should trigger special handling for high severity events', () => {
      auditLogger.logEvent({
        eventType: 'ROLE_VIOLATION',
        severity: 'HIGH',
        resourcePath: '/admin-resource',
        description: 'High severity role violation',
      });

      expect(mockConsole.error).toHaveBeenCalledWith(
        '🚨 SECURITY ALERT:',
        expect.objectContaining({
          severity: 'HIGH',
          description: 'High severity role violation',
        })
      );
    });

    it('should not trigger alerts for lower severity events', () => {
      auditLogger.logEvent({
        eventType: 'LOGIN_ATTEMPT',
        severity: 'LOW',
        resourcePath: '/login',
        description: 'Regular login attempt',
      });

      expect(mockConsole.error).not.toHaveBeenCalledWith(
        '🚨 SECURITY ALERT:',
        expect.any(Object)
      );
    });
  });
});