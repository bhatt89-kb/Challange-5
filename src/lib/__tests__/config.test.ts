import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getConfig } from '../config';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should load configuration with defaults', () => {
    const config = getConfig();

    expect(config).toHaveProperty('geminiApiKey');
    expect(config).toHaveProperty('rateLimitMaxRequests');
    expect(config).toHaveProperty('rateLimitWindowMs');
    expect(config).toHaveProperty('cacheTtlSeconds');
    expect(config).toHaveProperty('nodeEnv');
  });

  it('should use environment variables when available', () => {
    process.env.GEMINI_API_KEY = 'custom-key';
    process.env.RATE_LIMIT_MAX_REQUESTS = '20';
    process.env.RATE_LIMIT_WINDOW_MS = '30000';

    const config = getConfig();

    expect(config.geminiApiKey).toBe('custom-key');
    expect(config.rateLimitMaxRequests).toBe(20);
    expect(config.rateLimitWindowMs).toBe(30000);
  });

  it('should use default values when env vars not set', () => {
    delete process.env.RATE_LIMIT_MAX_REQUESTS;
    delete process.env.RATE_LIMIT_WINDOW_MS;

    const config = getConfig();

    expect(config.rateLimitMaxRequests).toBe(10);
    expect(config.rateLimitWindowMs).toBe(60000);
  });

  it('should throw error for invalid number format', () => {
    process.env.RATE_LIMIT_MAX_REQUESTS = 'not-a-number';

    expect(() => getConfig()).toThrow('Invalid number');
  });
});
