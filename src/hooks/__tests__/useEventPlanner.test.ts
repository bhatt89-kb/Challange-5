import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventPlanner } from '../useEventPlanner';

global.fetch = vi.fn();

describe('useEventPlanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useEventPlanner());

    expect(result.current.plan).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should generate plan successfully', async () => {
    const mockPlan = {
      planId: 'test-123',
      eventSummary: 'Test plan',
      budgetBreakdown: [],
      timeline: [],
      vendorChecklist: [],
      personalizedIdeas: [],
      tips: []
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockPlan })
    } as Response);

    const { result } = renderHook(() => useEventPlanner());

    await act(async () => {
      await result.current.generatePlan({
        eventType: 'birthday',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult'
      });
    });

    expect(result.current.plan).toEqual(mockPlan);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should handle errors', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'API Error' })
    } as Response);

    const { result } = renderHook(() => useEventPlanner());

    await act(async () => {
      try {
        await result.current.generatePlan({
          eventType: 'birthday',
          eventName: 'Test',
          date: '2024-12-31',
          location: 'Mumbai',
          budget: 50000,
          guestCount: 50,
          language: 'en',
          ageGroup: 'adult'
        });
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear plan', () => {
    const { result } = renderHook(() => useEventPlanner());

    act(() => {
      result.current.clearPlan();
    });

    expect(result.current.plan).toBeNull();
    expect(result.current.error).toBe('');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useEventPlanner());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe('');
  });
});
