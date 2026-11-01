import { config } from './config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ResponseCache {
  private cache: Map<string, CacheEntry<string>> = new Map();
  private readonly ttl: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(ttlSeconds = config.cacheTtlSeconds) {
    this.ttl = ttlSeconds * 1000;
    
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  public destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  private generateKey(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }

  get(input: Record<string, unknown>): string | null {
    const key = this.generateKey(input);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(input: Record<string, unknown>, data: string): void {
    const key = this.generateKey(input);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttl
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache(config.cacheTtlSeconds);
