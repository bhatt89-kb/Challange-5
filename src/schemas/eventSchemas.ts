import { z } from 'zod';
import { VALIDATION_LIMITS } from '@/lib/constants';

export const EventTypeEnum = z.enum(['wedding', 'birthday', 'community']);

export const BaseEventSchema = z.object({
  eventType: EventTypeEnum,
  eventName: z.string().min(1, 'Event name is required').max(VALIDATION_LIMITS.MAX_EVENT_NAME_LENGTH),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  location: z.string().min(1, 'Location is required').max(VALIDATION_LIMITS.MAX_LOCATION_LENGTH),
  budget: z.number().min(VALIDATION_LIMITS.MIN_BUDGET, `Minimum budget is ₹${VALIDATION_LIMITS.MIN_BUDGET}`).max(VALIDATION_LIMITS.MAX_BUDGET),
  guestCount: z.number().min(VALIDATION_LIMITS.MIN_GUESTS).max(VALIDATION_LIMITS.MAX_GUESTS),
  language: z.enum(['en', 'hi']).default('en'),
  additionalDetails: z.string().max(VALIDATION_LIMITS.MAX_ADDITIONAL_DETAILS_LENGTH).optional()
});

export const WeddingEventSchema = BaseEventSchema.extend({
  eventType: z.literal('wedding'),
  weddingStyle: z.enum(['traditional', 'modern', 'destination', 'intimate']),
  ceremonies: z.array(z.string()).min(1).max(10)
});

export const BirthdayEventSchema = BaseEventSchema.extend({
  eventType: z.literal('birthday'),
  ageGroup: z.enum(['child', 'teen', 'adult', 'senior']),
  theme: z.string().max(100).optional()
});

export const CommunityEventSchema = BaseEventSchema.extend({
  eventType: z.literal('community'),
  eventCategory: z.enum(['festival', 'charity', 'sports', 'cultural', 'social']),
  isPublic: z.boolean().default(false)
});

export const EventInputSchema = z.discriminatedUnion('eventType', [
  WeddingEventSchema,
  BirthdayEventSchema,
  CommunityEventSchema
]);

export const ChatMessageSchema = z.object({
  planId: z.string().min(1),
  message: z.string().min(1).max(VALIDATION_LIMITS.MAX_CHAT_MESSAGE_LENGTH),
  language: z.enum(['en', 'hi'])
});

export type EventInput = z.infer<typeof EventInputSchema>;
export type WeddingEvent = z.infer<typeof WeddingEventSchema>;
export type BirthdayEvent = z.infer<typeof BirthdayEventSchema>;
export type CommunityEvent = z.infer<typeof CommunityEventSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type EventType = z.infer<typeof EventTypeEnum>;
