import { z } from 'zod';

export const BudgetItemSchema = z.object({
  category: z.string(),
  description: z.string(),
  estimatedCost: z.number(),
  priority: z.enum(['high', 'medium', 'low'])
});

export const TimelineItemSchema = z.object({
  daysBeforeEvent: z.number(),
  task: z.string(),
  description: z.string(),
  responsible: z.string().optional()
});

export const VendorSchema = z.object({
  category: z.string(),
  type: z.string(),
  estimatedCost: z.string(),
  whenToBook: z.string(),
  tips: z.string()
});

export const PersonalizedIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string()
});

export const EventPlanSchema = z.object({
  planId: z.string(),
  eventSummary: z.string(),
  budgetBreakdown: z.array(BudgetItemSchema),
  timeline: z.array(TimelineItemSchema),
  vendorChecklist: z.array(VendorSchema),
  personalizedIdeas: z.array(PersonalizedIdeaSchema),
  tips: z.array(z.string())
});

export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type Vendor = z.infer<typeof VendorSchema>;
export type PersonalizedIdea = z.infer<typeof PersonalizedIdeaSchema>;
export type EventPlan = z.infer<typeof EventPlanSchema>;
