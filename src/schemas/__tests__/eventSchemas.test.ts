import { describe, it, expect } from 'vitest';
import { EventInputSchema, WeddingEventSchema, BirthdayEventSchema, CommunityEventSchema } from '../eventSchemas';

describe('Event Schemas', () => {
  describe('WeddingEventSchema', () => {
    it('should validate valid wedding input', () => {
      const input = {
        eventType: 'wedding',
        eventName: 'Test Wedding',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 500000,
        guestCount: 100,
        language: 'en',
        weddingStyle: 'traditional',
        ceremonies: ['Mehendi', 'Sangeet']
      };

      const result = WeddingEventSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject wedding without ceremonies', () => {
      const input = {
        eventType: 'wedding',
        eventName: 'Test Wedding',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 500000,
        guestCount: 100,
        language: 'en',
        weddingStyle: 'traditional',
        ceremonies: []
      };

      const result = WeddingEventSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('BirthdayEventSchema', () => {
    it('should validate valid birthday input', () => {
      const input = {
        eventType: 'birthday',
        eventName: 'John Birthday',
        date: '2024-06-15',
        location: 'Delhi',
        budget: 50000,
        guestCount: 50,
        language: 'en',
        ageGroup: 'adult',
        theme: 'Retro'
      };

      const result = BirthdayEventSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('CommunityEventSchema', () => {
    it('should validate valid community input', () => {
      const input = {
        eventType: 'community',
        eventName: 'Festival',
        date: '2024-08-15',
        location: 'Bangalore',
        budget: 200000,
        guestCount: 500,
        language: 'en',
        eventCategory: 'festival',
        isPublic: true
      };

      const result = CommunityEventSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('EventInputSchema discriminated union', () => {
    it('should validate discriminated union correctly', () => {
      const weddingInput = {
        eventType: 'wedding',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 500000,
        guestCount: 100,
        language: 'en',
        weddingStyle: 'modern',
        ceremonies: ['Wedding']
      };

      const result = EventInputSchema.safeParse(weddingInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid budget', () => {
      const input = {
        eventType: 'wedding',
        eventName: 'Test',
        date: '2024-12-31',
        location: 'Mumbai',
        budget: 50,
        guestCount: 100,
        language: 'en',
        weddingStyle: 'modern',
        ceremonies: ['Wedding']
      };

      const result = EventInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
