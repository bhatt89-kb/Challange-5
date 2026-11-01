// Application constants

export const API_ENDPOINTS = {
  GENERATE: '/api/generate',
  CHAT: '/api/chat'
} as const;

export const CACHE_KEYS = {
  EVENT_PLAN: 'event_plan',
  CHAT_HISTORY: 'chat_history'
} as const;

export const VALIDATION_LIMITS = {
  MIN_BUDGET: 100,
  MAX_BUDGET: 100000000,
  MIN_GUESTS: 1,
  MAX_GUESTS: 10000,
  MAX_EVENT_NAME_LENGTH: 200,
  MAX_LOCATION_LENGTH: 200,
  MAX_ADDITIONAL_DETAILS_LENGTH: 1000,
  MAX_CHAT_MESSAGE_LENGTH: 1000,
  MAX_INPUT_LENGTH: 5000
} as const;

export const SECURITY_LIMITS = {
  RATE_LIMIT_DEFAULT_MAX: 10,
  RATE_LIMIT_DEFAULT_WINDOW_MS: 60000,
  CACHE_DEFAULT_TTL_SECONDS: 3600,
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT_MS: 30000
} as const;

export const GEMINI_CONFIG = {
  MODEL: 'gemini-1.5-flash',
  MAX_OUTPUT_TOKENS: 8192,
  TEMPERATURE: 0.7
} as const;

export const ACCESSIBILITY = {
  SKIP_LINK_ID: 'main-content',
  MIN_TOUCH_TARGET_SIZE: 44 // pixels, WCAG guideline
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input detected',
  API_KEY_MISSING: 'API key not configured',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  GENERATION_FAILED: 'Failed to generate event plan',
  CHAT_FAILED: 'Failed to process chat message',
  VALIDATION_FAILED: 'Validation failed',
  GENERIC_ERROR: 'An error occurred'
} as const;
