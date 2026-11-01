import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatDate,
  truncate,
  isDefined,
  debounce,
  deepClone,
  isClient,
  isServer,
  generateId,
  clamp
} from '../utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format number as Indian currency', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(100000)).toBe('₹1,00,000');
      expect(formatCurrency(1000000)).toBe('₹10,00,000');
    });
  });

  describe('formatDate', () => {
    it('should format date string in English', () => {
      const result = formatDate('2024-12-31');
      expect(result).toContain('2024');
      expect(result).toContain('December');
    });

    it('should format date string in Hindi', () => {
      const result = formatDate('2024-12-31', 'hi');
      expect(result).toContain('2024');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for undefined or null', () => {
      expect(isDefined(undefined)).toBe(false);
      expect(isDefined(null)).toBe(false);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });
  });

  describe('isClient and isServer', () => {
    it('should detect client/server environment', () => {
      expect(isClient()).toBe(typeof window !== 'undefined');
      expect(isServer()).toBe(typeof window === 'undefined');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('clamp', () => {
    it('should clamp values between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});
