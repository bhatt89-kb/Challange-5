import { describe, it, expect, beforeEach } from 'vitest';
import { getClientIdentifier } from '../rateLimit';

describe('Rate Limiter', () => {
  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for', () => {
      const headers = new Headers();
      headers.set('x-forwarded-for', '192.168.1.1, 10.0.0.1');
      expect(getClientIdentifier(headers)).toBe('192.168.1.1');
    });

    it('should use x-real-ip as fallback', () => {
      const headers = new Headers();
      headers.set('x-real-ip', '192.168.1.2');
      expect(getClientIdentifier(headers)).toBe('192.168.1.2');
    });

    it('should return unknown if no IP found', () => {
      const headers = new Headers();
      expect(getClientIdentifier(headers)).toBe('unknown');
    });
  });
});
