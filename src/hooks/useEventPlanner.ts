import { useState, useCallback } from 'react';
import { EventInput } from '@/schemas/eventSchemas';
import { EventPlan } from '@/schemas/planSchemas';
import { ApiResponse } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

interface UseEventPlannerState {
  plan: EventPlan | null;
  isLoading: boolean;
  error: string;
}

interface UseEventPlannerReturn extends UseEventPlannerState {
  generatePlan: (input: EventInput) => Promise<void>;
  clearPlan: () => void;
  clearError: () => void;
}

export function useEventPlanner(): UseEventPlannerReturn {
  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = useCallback(async (input: EventInput): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const errorData: ApiResponse<never> = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const result: ApiResponse<EventPlan> = await response.json();
      
      if (result.success && result.data) {
        setPlan(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPlan = useCallback(() => {
    setPlan(null);
    setError('');
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    plan,
    isLoading,
    error,
    generatePlan,
    clearPlan,
    clearError
  };
}
