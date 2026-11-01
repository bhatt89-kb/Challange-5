import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  start(metricName: string): void {
    this.metrics.set(metricName, Date.now());
  }

  end(metricName: string, metadata?: Record<string, unknown>): void {
    const startTime = this.metrics.get(metricName);
    if (!startTime) {
      logger.warn('Performance metric not found', { metricName });
      return;
    }

    const duration = Date.now() - startTime;
    this.metrics.delete(metricName);

    const metric: PerformanceMetric = {
      name: metricName,
      duration,
      timestamp: Date.now()
    };

    logger.info('Performance metric', { ...metric, ...metadata });

    // Log warning for slow operations
    if (duration > 5000) {
      logger.warn('Slow operation detected', { ...metric, ...metadata });
    }
  }

  measure<T>(metricName: string, fn: () => T): T;
  measure<T>(metricName: string, fn: () => Promise<T>): Promise<T>;
  measure<T>(metricName: string, fn: () => T | Promise<T>): T | Promise<T> {
    this.start(metricName);
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result
          .then((value) => {
            this.end(metricName);
            return value;
          })
          .catch((error) => {
            this.end(metricName, { error: true });
            throw error;
          });
      }
      
      this.end(metricName);
      return result;
    } catch (error) {
      this.end(metricName, { error: true });
      throw error;
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
