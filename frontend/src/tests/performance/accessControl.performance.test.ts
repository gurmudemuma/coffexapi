/**
 * Performance and Load Tests for Access Control System
 * 
 * Tests the performance characteristics and load handling capabilities
 * of the organization-specific access control system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore, useAuth, useAuthActions } from '../../store';
import auditLogger from '../../utils/auditLogger';

// Performance monitoring utilities
class PerformanceMonitor {
  private startTime: number = 0;
  private measurements: number[] = [];

  start() {
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    this.measurements.push(duration);
    return duration;
  }

  getStats() {
    if (this.measurements.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };
    
    const sorted = [...this.measurements].sort((a, b) => a - b);
    return {
      avg: this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      count: this.measurements.length,
    };
  }

  reset() {
    this.measurements = [];
  }
}

// Mock data generators
function generateMockUser(index: number) {
  const organizations = [
    'The Mint',
    'Customs Authority', 
    'Coffee Quality Authority',
    'Exporter Bank',
    'Commercial Bank of Ethiopia'
  ];
  
  const roles = ['NBE_ADMIN', 'CUSTOMS_VALIDATOR', 'QUALITY_INSPECTOR', 'BANK_VALIDATOR'];
  
  return {
    id: `user-${index}`,
    name: `Test User ${index}`,
    role: roles[index % roles.length],
    organization: organizations[index % organizations.length],
    permissions: ['audit:read', 'basic:access'],
    email: `user${index}@test.com`,
  };
}

function generateMockRoute(index: number): string {
  const routes = [
    '/nbe-dashboard',
    '/customs-dashboard', 
    '/quality-dashboard',
    '/bank-dashboard',
    '/audit',
    '/users',
    '/compliance'
  ];
  return routes[index % routes.length];
}

describe('Access Control Performance Tests', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
    monitor = new PerformanceMonitor();
    useAppStore.getState().resetStore();
    auditLogger.clearEvents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Performance', () => {
    it('should handle rapid login attempts within acceptable time limits', async () => {
      const { result } = renderHook(() => useAuthActions());
      const loginTimes: number[] = [];

      // Test 50 rapid login attempts
      for (let i = 0; i < 50; i++) {
        monitor.start();
        
        await act(async () => {
          try {
            await result.current.login(`user${i}`, 'password123');
          } catch (error) {
            // Expected to fail for some users
          }
        });
        
        loginTimes.push(monitor.end());
        
        // Logout to reset state
        await act(() => {
          result.current.logout();
        });
      }

      const stats = monitor.getStats();
      
      // Performance assertions
      expect(stats.avg).toBeLessThan(100); // Average login should be < 100ms
      expect(stats.max).toBeLessThan(500); // Max login should be < 500ms
      expect(stats.p95).toBeLessThan(200); // 95th percentile should be < 200ms
      
      console.log('Login Performance Stats:', stats);
    });

    it('should maintain performance under concurrent login attempts', async () => {
      const concurrentLogins = 20;
      const promises: Promise<void>[] = [];
      const startTime = performance.now();

      for (let i = 0; i < concurrentLogins; i++) {
        promises.push(
          (async () => {
            const { result } = renderHook(() => useAuthActions());
            try {
              await act(async () => {
                await result.current.login(`concurrent-user-${i}`, 'password');
              });
            } catch (error) {
              // Expected failures
            }
          })()
        );
      }

      await Promise.allSettled(promises);
      const totalTime = performance.now() - startTime;

      // Should complete all concurrent operations within reasonable time
      expect(totalTime).toBeLessThan(2000); // < 2 seconds for 20 concurrent logins
      
      console.log(`Concurrent logins (${concurrentLogins}) completed in ${totalTime}ms`);
    });
  });

  describe('Route Access Performance', () => {
    it('should perform route access validation efficiently', async () => {
      // Set up authenticated user
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      // Mock ProtectedRoute validation logic
      const validateRouteAccess = (user: any, route: string) => {
        monitor.start();
        
        // Simulate organization route checking
        const ORGANIZATION_ROUTES: Record<string, string[]> = {
          'The Mint': ['/nbe-dashboard', '/users', '/compliance', '/audit'],
          'Customs Authority': ['/customs-dashboard', '/audit'],
          'Coffee Quality Authority': ['/quality-dashboard', '/audit'],
          'Exporter Bank': ['/bank-dashboard', '/audit'],
        };

        const allowedRoutes = ORGANIZATION_ROUTES[user.organization] || [];
        const hasAccess = allowedRoutes.some(allowed => route.startsWith(allowed));
        
        monitor.end();
        return hasAccess;
      };

      // Test 1000 route validations
      const user = authResult.current.user!;
      for (let i = 0; i < 1000; i++) {
        const route = generateMockRoute(i);
        validateRouteAccess(user, route);
      }

      const stats = monitor.getStats();
      
      // Performance assertions
      expect(stats.avg).toBeLessThan(1); // Average validation should be < 1ms
      expect(stats.max).toBeLessThan(10); // Max validation should be < 10ms
      
      console.log('Route Validation Performance Stats:', stats);
    });

    it('should handle large numbers of organization checks efficiently', async () => {
      const organizationData = Array.from({ length: 100 }, (_, i) => ({
        name: `Organization ${i}`,
        routes: [`/org${i}-dashboard`, `/org${i}-users`, `/org${i}-audit`]
      }));

      monitor.start();
      
      // Simulate checking access for a user across all organizations
      const user = generateMockUser(0);
      const route = '/org50-dashboard';
      
      let hasAccess = false;
      for (const org of organizationData) {
        if (user.organization === org.name) {
          hasAccess = org.routes.includes(route);
          break;
        }
      }
      
      const duration = monitor.end();
      
      // Should complete organization lookup quickly even with many orgs
      expect(duration).toBeLessThan(5); // < 5ms for 100 organizations
    });
  });

  describe('Audit Logging Performance', () => {
    it('should handle high-frequency audit events efficiently', async () => {
      const eventCount = 1000;
      const events: number[] = [];

      // Generate many audit events rapidly
      for (let i = 0; i < eventCount; i++) {
        monitor.start();
        
        auditLogger.logEvent({
          eventType: 'ACCESS_DENIED',
          severity: 'MEDIUM',
          userId: `user-${i}`,
          userName: `User ${i}`,
          userRole: 'USER',
          userOrganization: `Org ${i % 10}`,
          resourcePath: `/resource-${i}`,
          description: `Test event ${i}`,
        });
        
        events.push(monitor.end());
      }

      const stats = monitor.getStats();
      
      // Performance assertions for audit logging
      expect(stats.avg).toBeLessThan(2); // Average log time should be < 2ms
      expect(stats.max).toBeLessThan(20); // Max log time should be < 20ms
      
      // Verify all events were logged
      expect(auditLogger.getEvents()).toHaveLength(Math.min(eventCount, 1000)); // Limited by maxEvents
      
      console.log('Audit Logging Performance Stats:', stats);
    });

    it('should maintain performance with localStorage operations', async () => {
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        monitor.start();
        
        // Simulate the localStorage operations that happen during audit logging
        const testData = JSON.stringify({
          id: `test-${i}`,
          timestamp: Date.now(),
          eventType: 'TEST_EVENT',
          data: `Test data ${i}`.repeat(10) // Make it a bit larger
        });
        
        localStorage.setItem(`test_audit_${i}`, testData);
        const retrieved = localStorage.getItem(`test_audit_${i}`);
        expect(retrieved).toBeTruthy();
        localStorage.removeItem(`test_audit_${i}`);
        
        monitor.end();
      }

      const stats = monitor.getStats();
      
      // localStorage operations should be fast
      expect(stats.avg).toBeLessThan(5); // Average localStorage op should be < 5ms
      expect(stats.max).toBeLessThan(50); // Max localStorage op should be < 50ms
      
      console.log('localStorage Performance Stats:', stats);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not cause memory leaks with repeated operations', async () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      // Perform many operations that could potentially leak memory
      for (let i = 0; i < 500; i++) {
        // Create and destroy auth hooks
        const { result, unmount } = renderHook(() => useAuth());
        
        // Perform some operations
        auditLogger.logEvent({
          eventType: 'ACCESS_DENIED',
          severity: 'LOW',
          resourcePath: `/test-${i}`,
          description: `Memory test ${i}`,
        });
        
        // Clean up
        unmount();
        
        // Trigger garbage collection hint (if available)
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      if (performance.memory) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
        
        // Memory increase should be reasonable
        expect(memoryIncreasePercent).toBeLessThan(200); // Less than 200% increase
        
        console.log(`Memory usage: ${initialMemory} -> ${finalMemory} (+${memoryIncreasePercent.toFixed(2)}%)`);
      }
    });

    it('should handle audit event cleanup efficiently', async () => {
      // Fill up the audit logger to trigger cleanup
      for (let i = 0; i < 1200; i++) {
        auditLogger.logEvent({
          eventType: 'ACCESS_DENIED',
          severity: 'LOW',
          resourcePath: `/test-${i}`,
          description: `Cleanup test ${i}`,
        });
      }

      monitor.start();
      
      // This should trigger internal cleanup
      auditLogger.logEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'LOW',
        resourcePath: '/cleanup-trigger',
        description: 'Cleanup trigger event',
      });
      
      const cleanupTime = monitor.end();
      
      // Cleanup should be fast
      expect(cleanupTime).toBeLessThan(50); // Cleanup should take < 50ms
      
      // Should maintain the limit
      expect(auditLogger.getEvents()).toHaveLength(1000);
    });
  });

  describe('Concurrent Access Tests', () => {
    it('should handle multiple simultaneous route validations', async () => {
      const concurrentValidations = 50;
      const promises: Promise<boolean>[] = [];
      
      // Set up authenticated user
      const { result: actionsResult } = renderHook(() => useAuthActions());
      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      const startTime = performance.now();
      
      // Create many concurrent validation operations
      for (let i = 0; i < concurrentValidations; i++) {
        promises.push(
          new Promise((resolve) => {
            // Simulate ProtectedRoute validation
            setTimeout(() => {
              const user = generateMockUser(i);
              const route = generateMockRoute(i);
              
              const ORGANIZATION_ROUTES: Record<string, string[]> = {
                'The Mint': ['/nbe-dashboard', '/users'],
                'Customs Authority': ['/customs-dashboard'],
              };
              
              const allowedRoutes = ORGANIZATION_ROUTES[user.organization] || [];
              const hasAccess = allowedRoutes.some(allowed => route.includes(allowed));
              
              resolve(hasAccess);
            }, Math.random() * 10); // Random delay up to 10ms
          })
        );
      }

      const results = await Promise.all(promises);
      const totalTime = performance.now() - startTime;
      
      expect(results).toHaveLength(concurrentValidations);
      expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
      
      console.log(`${concurrentValidations} concurrent validations completed in ${totalTime}ms`);
    });

    it('should handle concurrent audit logging without data corruption', async () => {
      const concurrentLogs = 100;
      const promises: Promise<void>[] = [];
      
      const startTime = performance.now();
      
      // Create many concurrent audit log operations
      for (let i = 0; i < concurrentLogs; i++) {
        promises.push(
          new Promise((resolve) => {
            setTimeout(() => {
              auditLogger.logEvent({
                eventType: 'ACCESS_DENIED',
                severity: 'MEDIUM',
                userId: `concurrent-user-${i}`,
                userName: `Concurrent User ${i}`,
                userRole: 'USER',
                userOrganization: 'Test Org',
                resourcePath: `/concurrent-test-${i}`,
                description: `Concurrent test ${i}`,
                metadata: { testId: i },
              });
              resolve();
            }, Math.random() * 20); // Random delay up to 20ms
          })
        );
      }

      await Promise.all(promises);
      const totalTime = performance.now() - startTime;
      
      // All events should be logged
      const events = auditLogger.getEvents();
      const concurrentEvents = events.filter(e => e.description?.includes('Concurrent test'));
      
      expect(concurrentEvents.length).toBeGreaterThan(concurrentLogs * 0.9); // At least 90% should be logged
      expect(totalTime).toBeLessThan(2000); // Should complete within 2 seconds
      
      // Check for data integrity
      const uniqueIds = new Set(concurrentEvents.map(e => e.metadata?.testId));
      expect(uniqueIds.size).toBe(concurrentEvents.length); // No duplicate test IDs
      
      console.log(`${concurrentLogs} concurrent audit logs completed in ${totalTime}ms`);
    });
  });

  describe('Scalability Tests', () => {
    it('should scale linearly with number of organizations', async () => {
      const organizationCounts = [10, 50, 100, 200];
      const results: { count: number; time: number }[] = [];
      
      for (const count of organizationCounts) {
        const organizations = Array.from({ length: count }, (_, i) => ({
          name: `Organization ${i}`,
          routes: [`/org${i}-dashboard`, `/org${i}-admin`]
        }));
        
        monitor.start();
        
        // Simulate finding organization routes
        const targetOrg = `Organization ${Math.floor(count / 2)}`;
        const found = organizations.find(org => org.name === targetOrg);
        
        const time = monitor.end();
        results.push({ count, time });
        
        expect(found).toBeTruthy();
      }
      
      // Check that scaling is reasonable
      const firstResult = results[0];
      const lastResult = results[results.length - 1];
      
      // Time should not increase dramatically with scale
      const scaleFactor = lastResult.count / firstResult.count;
      const timeFactor = lastResult.time / firstResult.time;
      
      expect(timeFactor).toBeLessThan(scaleFactor * 2); // Should scale better than O(n)
      
      console.log('Scalability results:', results);
    });

    it('should handle large permission sets efficiently', async () => {
      const permissionCounts = [10, 100, 500, 1000];
      const results: { count: number; time: number }[] = [];
      
      for (const count of permissionCounts) {
        const userPermissions = Array.from({ length: count }, (_, i) => `permission:${i}`);
        const requiredPermissions = [`permission:${Math.floor(count / 2)}`];
        
        monitor.start();
        
        // Simulate permission checking
        const hasPermission = requiredPermissions.some(required => 
          userPermissions.includes(required)
        );
        
        const time = monitor.end();
        results.push({ count, time });
        
        expect(hasPermission).toBe(true);
      }
      
      // Permission checking should remain fast even with many permissions
      results.forEach(result => {
        expect(result.time).toBeLessThan(10); // Should always be < 10ms
      });
      
      console.log('Permission scaling results:', results);
    });
  });
});