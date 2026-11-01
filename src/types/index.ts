// Centralized type definitions for better type safety

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ path: string; message: string }>;
}

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
}

export interface CacheOptions {
  ttl?: number;
  key: string;
}

export interface LogMetadata {
  [key: string]: unknown;
}

export interface StreamChunk {
  text?: string;
  error?: string;
}

export type Language = 'en' | 'hi';

export interface EnvironmentConfig {
  geminiApiKey: string;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
  cacheTtlSeconds: number;
  nodeEnv: 'development' | 'production' | 'test';
}
