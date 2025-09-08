/**
 * Performance Monitoring Utility
 * Tracks and reports performance metrics for the coffee export platform
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'load-time' | 'search-response' | 'memory-usage' | 'render-time';
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    averageLoadTime: number;
    averageSearchTime: number;
    memoryUsage: number;
    renderCount: number;
  };
  recommendations: string[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private renderCount = 0;
  private startTime = performance.now();

  /**
   * Measure execution time of a function
   */
  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.addMetric({
      name,
      value: end - start,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'render-time'
    });
    
    return result;
  }

  /**
   * Measure async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.addMetric({
      name,
      value: end - start,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'load-time'
    });
    
    return result;
  }

  /**
   * Track component render
   */
  trackRender(componentName: string) {
    this.renderCount++;
    this.addMetric({
      name: `${componentName}_render`,
      value: this.renderCount,
      unit: 'count',
      timestamp: Date.now(),
      category: 'render-time'
    });
  }

  /**
   * Track search performance
   */
  trackSearch(searchTerm: string, resultCount: number, duration: number) {
    this.addMetric({
      name: 'search_performance',
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'search-response'
    });
  }

  /**
   * Get memory usage
   */
  getMemoryUsage(): number {
    if ('memory' in performance && performance.memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  /**
   * Add a performance metric
   */
  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const loadTimeMetrics = this.metrics.filter(m => m.category === 'load-time');
    const searchMetrics = this.metrics.filter(m => m.category === 'search-response');
    const renderMetrics = this.metrics.filter(m => m.category === 'render-time');

    const averageLoadTime = loadTimeMetrics.length > 0 
      ? loadTimeMetrics.reduce((sum, m) => sum + m.value, 0) / loadTimeMetrics.length 
      : 0;

    const averageSearchTime = searchMetrics.length > 0 
      ? searchMetrics.reduce((sum, m) => sum + m.value, 0) / searchMetrics.length 
      : 0;

    const memoryUsage = this.getMemoryUsage();

    const recommendations: string[] = [];
    
    if (averageLoadTime > 1000) {
      recommendations.push('Consider implementing virtual scrolling for large datasets');
    }
    
    if (averageSearchTime > 100) {
      recommendations.push('Implement debounced search to reduce API calls');
    }
    
    if (memoryUsage > 100) {
      recommendations.push('Consider implementing data pagination to reduce memory usage');
    }

    return {
      metrics: this.metrics,
      summary: {
        averageLoadTime,
        averageSearchTime,
        memoryUsage,
        renderCount: this.renderCount
      },
      recommendations
    };
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.renderCount = 0;
    this.startTime = performance.now();
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    measure: performanceMonitor.measure.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    trackRender: performanceMonitor.trackRender.bind(performanceMonitor),
    trackSearch: performanceMonitor.trackSearch.bind(performanceMonitor),
    getMemoryUsage: performanceMonitor.getMemoryUsage.bind(performanceMonitor),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor),
    clear: performanceMonitor.clear.bind(performanceMonitor),
    exportMetrics: performanceMonitor.exportMetrics.bind(performanceMonitor)
  };
};

export default performanceMonitor;
