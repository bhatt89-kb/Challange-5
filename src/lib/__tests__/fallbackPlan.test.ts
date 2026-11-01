import { describe, it, expect } from 'vitest';
import { generateOfflineFallbackPlan } from '../fallbackPlan';
import { EventInput } from '@/schemas/eventSchemas';

describe('Fallback Plan Generator', () => {
  it('should generate plan for wedding event in English', () => {
    const input: EventInput = {
      eventType: 'wedding',
      eventName: 'Raj & Priya Wedding',
      date: '2024-12-15',
      location: 'Mumbai',
      budget: 1000000,
      guestCount: 200,
      language: 'en',
      weddingStyle: 'traditional',
      ceremonies: ['Mehendi', 'Sangeet', 'Wedding']
    };

    const plan = generateOfflineFallbackPlan(input);

    expect(plan.planId).toContain('offline-');
    expect(plan.eventSummary).toContain('Raj & Priya Wedding');
    expect(plan.budgetBreakdown).toHaveLength(6);
    expect(plan.timeline.length).toBeGreaterThan(0);
    expect(plan.vendorChecklist.length).toBeGreaterThan(0);
    expect(plan.personalizedIdeas.length).toBeGreaterThan(0);
    expect(plan.tips.length).toBeGreaterThan(0);
  });

  it('should generate plan in Hindi', () => {
    const input: EventInput = {
      eventType: 'birthday',
      eventName: 'Amit Birthday',
      date: '2024-11-20',
      location: 'Delhi',
      budget: 50000,
      guestCount: 50,
      language: 'hi',
      ageGroup: 'adult',
      theme: 'Retro'
    };

    const plan = generateOfflineFallbackPlan(input);

    expect(plan.eventSummary).toContain('Amit Birthday');
    expect(plan.budgetBreakdown[0]?.category).toContain('स्थल');
    expect(plan.tips[0]).toMatch(/[ा-ॿ]/); // Contains Hindi characters
  });

  it('should calculate budget breakdown correctly', () => {
    const input: EventInput = {
      eventType: 'community',
      eventName: 'Community Festival',
      date: '2024-10-10',
      location: 'Bangalore',
      budget: 500000,
      guestCount: 500,
      language: 'en',
      eventCategory: 'festival',
      isPublic: true
    };

    const plan = generateOfflineFallbackPlan(input);
    const totalBudget = plan.budgetBreakdown.reduce((sum, item) => sum + item.estimatedCost, 0);

    expect(totalBudget).toBeLessThanOrEqual(input.budget);
    expect(totalBudget).toBeGreaterThan(input.budget * 0.95);
  });
});
