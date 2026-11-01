import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performanceMonitor } from '../performance';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should measure synchronous operations', () => {
    const result = performanceMonitor.measure('test-sync', () => {
      return 'result';
    });

    expect(result).toBe('result');
  });

  it('should measure asynchronous operations', async () => {
    const result = await performanceMonitor.measure('test-async', async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async-result';
    });

    expect(result).toBe('async-result');
  });

  it('should handle errors in synchronous operations', () => {
    expect(() => {
      performanceMonitor.measure('test-error', () => {
        throw new Error('Test error');
      });
    }).toThrow('Test error');
  });

  it('should handle errors in asynchronous operations', async () => {
    await expect(
      performanceMonitor.measure('test-async-error', async () => {
        throw new Error('Async error');
      })
    ).rejects.toThrow('Async error');
  });

  it('should track metrics with start and end', () => {
    performanceMonitor.start('manual-metric');
    // Simulate some work
    const sum = Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0);
    performanceMonitor.end('manual-metric');

    expect(sum).toBeGreaterThan(0);
  });
});
