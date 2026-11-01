import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/gemini', () => ({
  generateEventPlan: vi.fn()
}));

vi.mock('@/lib/rateLimit', () => ({
  rateLimiter: {
    check: vi.fn()
  },
  getClientIdentifier: vi.fn(() => '127.0.0.1')
}));

vi.mock('@/lib/cache', () => ({
  responseCache: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

import { generateEventPlan } from '@/lib/gemini';
import { rateLimiter } from '@/lib/rateLimit';
import { responseCache } from '@/lib/cache';

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(rateLimiter.check).mockReturnValue({ allowed: true, remaining: 9 });
    vi.mocked(responseCache.get).mockReturnValue(null);
  });

  it('should generate plan successfully', async () => {
    const mockPlan = {
      planId: 'test-123',
      eventSummary: 'Test summary',
      budgetBreakdown: [],
      timeline: [],
      vendorChecklist: [],
      personalizedIdeas: [],
      tips: []
    };

    vi.mocked(generateEventPlan).mockResolvedValue(mockPlan);

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        eventType: 'birthday',
        eventName: 'Test Party',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockPlan);
  });

  it('should reject invalid input', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        eventType: 'birthday',
        eventName: 'Test',
        // Missing required fields
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should enforce rate limiting', async () => {
    vi.mocked(rateLimiter.check).mockReturnValue({ allowed: false, remaining: 0 });

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        eventType: 'birthday',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult'
      })
    });

    const response = await POST(request);

    expect(response.status).toBe(429);
  });

  it('should return cached response when available', async () => {
    const cachedPlan = {
      success: true,
      data: {
        planId: 'cached-123',
        eventSummary: 'Cached',
        budgetBreakdown: [],
        timeline: [],
        vendorChecklist: [],
        personalizedIdeas: [],
        tips: []
      }
    };

    vi.mocked(responseCache.get).mockReturnValue(JSON.stringify(cachedPlan));

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        eventType: 'birthday',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Cache-Status')).toBe('HIT');
    expect(data).toEqual(cachedPlan);
    expect(generateEventPlan).not.toHaveBeenCalled();
  });

  it('should use fallback plan when AI fails', async () => {
    vi.mocked(generateEventPlan).mockRejectedValue(new Error('AI Error'));

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        eventType: 'birthday',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.planId).toContain('offline-');
  });
});
