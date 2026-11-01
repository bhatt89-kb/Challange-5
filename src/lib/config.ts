import { EnvironmentConfig } from '@/types';

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable ${key}: ${value}`);
  }
  return parsed;
}

export function getConfig(): EnvironmentConfig {
  return {
    geminiApiKey: getEnvVar('GEMINI_API_KEY', 'test-key'),
    rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 10),
    rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60000),
    cacheTtlSeconds: getEnvNumber('CACHE_TTL_SECONDS', 3600),
    nodeEnv: (process.env.NODE_ENV as EnvironmentConfig['nodeEnv']) || 'development'
  };
}

export const config = getConfig();
