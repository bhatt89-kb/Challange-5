import { RateLimitInfo } from '@/types';
import { config } from './config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    this.cleanupInterval = setInterval(() => this.cleanup(), this.windowMs);
  }

  public destroy(): void {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  check(identifier: string): RateLimitInfo {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count };
  }
}

export const rateLimiter = new RateLimiter(
  config.rateLimitMaxRequests,
  config.rateLimitWindowMs
);

export function getClientIdentifier(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
