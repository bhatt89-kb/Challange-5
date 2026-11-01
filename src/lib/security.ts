import { VALIDATION_LIMITS } from './constants';

const SUSPICIOUS_PATTERNS = [
  /ignore\s+(previous|above|prior)\s+instructions?/i,
  /disregard\s+(previous|above|prior)\s+instructions?/i,
  /forget\s+(previous|above|prior)\s+instructions?/i,
  /you\s+are\s+now/i,
  /new\s+instructions?:/i,
  /system\s+prompt/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /jailbreak/i
];

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, VALIDATION_LIMITS.MAX_INPUT_LENGTH);
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m] ?? m);
}

export function detectPromptInjection(input: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

export function validateOrigin(origin: string | null): boolean {
  if (!origin) return true;
  
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL
  ].filter(Boolean);
  
  return allowedOrigins.some(allowed => origin === allowed);
}
