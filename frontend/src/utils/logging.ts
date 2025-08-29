/**
 * Frontend Logging and Monitoring System
 * 
 * This module provides comprehensive logging, monitoring, and analytics
 * capabilities for the Coffee Export Platform frontend.
 */

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  operation?: string;
  duration?: number;
  error?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
  url?: string;
  userAgent?: string;
  environment: string;
  version: string;
}

// Performance metrics
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  navigationTiming: PerformanceNavigationTiming;
  resourceTimings: PerformanceResourceTiming[];
  memoryInfo?: any;
}

// User interaction metrics
export interface UserInteractionMetrics {
  clickEvents: number;
  formSubmissions: number;
  navigations: number;
  errors: number;
  sessionDuration: number;
  pageViews: number;
  uniquePages: Set<string>;
}

// System health metrics
export interface SystemHealth {
  online: boolean;
  apiConnectivity: boolean;
  lastApiCall: Date | null;
  errorRate: number;
  responseTime: number;
  localStorage: boolean;
  serviceWorker: boolean;
}

// Logger class
export class Logger {
  private level: LogLevel = LogLevel.INFO;
  private service: string;
  private environment: string;
  private version: string;
  private sessionId: string;
  private userId?: string;
  private buffer: LogEntry[] = [];
  private bufferSize = 100;
  private flushInterval = 30000; // 30 seconds
  private endpoint?: string;
  private metricsCollector: MetricsCollector;

  constructor(
    service: string,
    environment: string = 'development',
    version: string = '1.0.0',
    endpoint?: string
  ) {
    this.service = service;
    this.environment = environment;
    this.version = version;
    this.endpoint = endpoint;
    this.sessionId = this.generateSessionId();
    this.metricsCollector = new MetricsCollector();

    // Set log level from environment or localStorage
    const savedLevel = localStorage.getItem('logLevel');
    if (savedLevel) {
      this.level = parseInt(savedLevel, 10);
    } else if (environment === 'development') {
      this.level = LogLevel.DEBUG;
    }

    // Start periodic buffer flush
    this.startPeriodicFlush();

    // Monitor system health
    this.monitorSystemHealth();
  }

  // Set user ID for contextual logging
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Set log level
  setLevel(level: LogLevel): void {
    this.level = level;
    localStorage.setItem('logLevel', level.toString());
  }

  // Create log entry
  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      environment: this.environment,
      version: this.version,
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata,
    };

    if (error) {
      entry.error = error.message;
      entry.stackTrace = error.stack;
    }

    return entry;
  }

  // Log methods
  debug(message: string, metadata?: Record<string, any>): void {
    if (this.level <= LogLevel.DEBUG) {
      this.log(LogLevel.DEBUG, message, metadata);
    }
  }

  info(message: string, metadata?: Record<string, any>): void {
    if (this.level <= LogLevel.INFO) {
      this.log(LogLevel.INFO, message, metadata);
    }
  }

  warn(message: string, metadata?: Record<string, any>): void {
    if (this.level <= LogLevel.WARN) {
      this.log(LogLevel.WARN, message, metadata);
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    if (this.level <= LogLevel.ERROR) {
      this.log(LogLevel.ERROR, message, metadata, error);
    }
  }

  fatal(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, metadata, error);
    this.flush(); // Immediately flush fatal errors
  }

  // Performance logging
  performance(operation: string, startTime: number, metadata?: Record<string, any>): void {
    const duration = performance.now() - startTime;
    this.info(`Performance: ${operation}`, {
      operation,
      duration: Math.round(duration),
      ...metadata,
    });
  }

  // User interaction logging
  userAction(action: string, target?: string, metadata?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      action,
      target,
      ...metadata,
    });
    this.metricsCollector.recordUserAction(action);
  }

  // API call logging
  apiCall(
    method: string,
    url: string,
    status: number,
    duration: number,
    requestId?: string
  ): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, `API Call: ${method} ${url}`, {
      method,
      url,
      status,
      duration,
      requestId,
    });
    this.metricsCollector.recordApiCall(status, duration);
  }

  // Private log method
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ): void {
    const entry = this.createLogEntry(level, message, metadata, error);

    // Add to buffer
    this.buffer.push(entry);

    // Console output for development
    if (this.environment === 'development') {
      this.consoleOutput(entry);
    }

    // Flush buffer if it's full or if it's an error
    if (this.buffer.length >= this.bufferSize || level >= LogLevel.ERROR) {
      this.flush();
    }
  }

  // Console output
  private consoleOutput(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${levelName}] [${entry.service}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.metadata);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.metadata);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.metadata);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, entry.message, entry.error, entry.metadata);
        break;
    }
  }

  // Flush buffer to server
  async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.endpoint) return;

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(`${this.endpoint}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Failed to send logs - store in localStorage as backup
      const stored = localStorage.getItem('unsent_logs') || '[]';
      const unsentLogs = JSON.parse(stored);
      unsentLogs.push(...logs);
      
      // Keep only last 1000 unsent logs
      if (unsentLogs.length > 1000) {
        unsentLogs.splice(0, unsentLogs.length - 1000);
      }
      
      localStorage.setItem('unsent_logs', JSON.stringify(unsentLogs));
    }
  }

  // Start periodic buffer flush
  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  // Generate session ID
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Monitor system health
  private monitorSystemHealth(): void {
    setInterval(() => {
      const health = this.metricsCollector.getSystemHealth();
      if (!health.online || !health.apiConnectivity || health.errorRate > 10) {
        this.warn('System health degraded', { health });
      }
    }, 60000); // Check every minute
  }

  // Get metrics
  getMetrics(): {
    performance: PerformanceMetrics;
    userInteraction: UserInteractionMetrics;
    systemHealth: SystemHealth;
  } {
    return {
      performance: this.metricsCollector.getPerformanceMetrics(),
      userInteraction: this.metricsCollector.getUserInteractionMetrics(),
      systemHealth: this.metricsCollector.getSystemHealth(),
    };
  }
}

// Metrics collector class
export class MetricsCollector {
  private userInteractions: UserInteractionMetrics = {
    clickEvents: 0,
    formSubmissions: 0,
    navigations: 0,
    errors: 0,
    sessionDuration: 0,
    pageViews: 0,
    uniquePages: new Set(),
  };

  private sessionStart = Date.now();
  private apiCalls: { status: number; duration: number; timestamp: number }[] = [];
  private lastApiCall: Date | null = null;

  constructor() {
    this.initializePerformanceObserver();
    this.initializeUserInteractionTracking();
    this.trackPageView();
  }

  // Record user action
  recordUserAction(action: string): void {
    switch (action) {
      case 'click':
        this.userInteractions.clickEvents++;
        break;
      case 'submit':
        this.userInteractions.formSubmissions++;
        break;
      case 'navigate':
        this.userInteractions.navigations++;
        break;
      case 'error':
        this.userInteractions.errors++;
        break;
    }
  }

  // Record API call
  recordApiCall(status: number, duration: number): void {
    this.apiCalls.push({
      status,
      duration,
      timestamp: Date.now(),
    });

    // Keep only last 100 API calls
    if (this.apiCalls.length > 100) {
      this.apiCalls.shift();
    }

    this.lastApiCall = new Date();
  }

  // Get performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
      firstContentfulPaint: this.getPerformanceMetric('first-contentful-paint'),
      largestContentfulPaint: this.getPerformanceMetric('largest-contentful-paint'),
      firstInputDelay: this.getPerformanceMetric('first-input-delay'),
      cumulativeLayoutShift: this.getPerformanceMetric('cumulative-layout-shift'),
      navigationTiming: navigation,
      resourceTimings: resources,
      memoryInfo: (performance as any).memory || {},
    };
  }

  // Get user interaction metrics
  getUserInteractionMetrics(): UserInteractionMetrics {
    return {
      ...this.userInteractions,
      sessionDuration: Date.now() - this.sessionStart,
    };
  }

  // Get system health
  getSystemHealth(): SystemHealth {
    const recentApiCalls = this.apiCalls.filter(
      call => Date.now() - call.timestamp < 300000 // Last 5 minutes
    );

    const errorCalls = recentApiCalls.filter(call => call.status >= 400);
    const errorRate = recentApiCalls.length > 0 
      ? (errorCalls.length / recentApiCalls.length) * 100 
      : 0;

    const avgResponseTime = recentApiCalls.length > 0
      ? recentApiCalls.reduce((sum, call) => sum + call.duration, 0) / recentApiCalls.length
      : 0;

    return {
      online: navigator.onLine,
      apiConnectivity: this.lastApiCall ? Date.now() - this.lastApiCall.getTime() < 300000 : false,
      lastApiCall: this.lastApiCall,
      errorRate,
      responseTime: avgResponseTime,
      localStorage: this.checkLocalStorage(),
      serviceWorker: 'serviceWorker' in navigator,
    };
  }

  // Initialize performance observer
  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Store performance entries for later analysis
            if (entry.entryType === 'paint' || entry.entryType === 'largest-contentful-paint') {
              // Handle paint metrics
            }
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      } catch (error) {
        // PerformanceObserver not supported or failed to initialize
      }
    }
  }

  // Initialize user interaction tracking
  private initializeUserInteractionTracking(): void {
    document.addEventListener('click', () => this.recordUserAction('click'));
    document.addEventListener('submit', () => this.recordUserAction('submit'));
    
    // Track navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.recordUserAction('navigate');
        this.trackPageView();
      }
    }).observe(document, { subtree: true, childList: true });

    // Track errors
    window.addEventListener('error', () => this.recordUserAction('error'));
    window.addEventListener('unhandledrejection', () => this.recordUserAction('error'));
  }

  // Track page view
  private trackPageView(): void {
    this.userInteractions.pageViews++;
    this.userInteractions.uniquePages.add(location.pathname);
  }

  // Get performance metric value
  private getPerformanceMetric(name: string): number {
    const entries = performance.getEntriesByName(name);
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  // Check localStorage availability
  private checkLocalStorage(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }
}

// Error boundary logging
export class ErrorBoundaryLogger {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  logError(error: Error, errorInfo: { componentStack: string }): void {
    this.logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }
}

// Create default logger instance
let defaultLogger: Logger;

export const initializeLogger = (
  service: string = 'coffee-export-frontend',
  environment?: string,
  version?: string,
  endpoint?: string
): Logger => {
  const env = environment || process.env.NODE_ENV || 'development';
  const ver = version || process.env.REACT_APP_VERSION || '1.0.0';
  const logEndpoint = endpoint || process.env.REACT_APP_LOG_ENDPOINT;

  defaultLogger = new Logger(service, env, ver, logEndpoint);
  return defaultLogger;
};

export const getLogger = (): Logger => {
  if (!defaultLogger) {
    return initializeLogger();
  }
  return defaultLogger;
};

// Convenience functions
export const log = {
  debug: (message: string, metadata?: Record<string, any>) => 
    getLogger().debug(message, metadata),
  
  info: (message: string, metadata?: Record<string, any>) => 
    getLogger().info(message, metadata),
  
  warn: (message: string, metadata?: Record<string, any>) => 
    getLogger().warn(message, metadata),
  
  error: (message: string, error?: Error, metadata?: Record<string, any>) => 
    getLogger().error(message, error, metadata),
  
  fatal: (message: string, error?: Error, metadata?: Record<string, any>) => 
    getLogger().fatal(message, error, metadata),
  
  performance: (operation: string, startTime: number, metadata?: Record<string, any>) => 
    getLogger().performance(operation, startTime, metadata),
  
  userAction: (action: string, target?: string, metadata?: Record<string, any>) => 
    getLogger().userAction(action, target, metadata),
  
  apiCall: (method: string, url: string, status: number, duration: number, requestId?: string) => 
    getLogger().apiCall(method, url, status, duration, requestId),
};

export default log;