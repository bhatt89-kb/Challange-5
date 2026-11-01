import { NextRequest, NextResponse } from 'next/server';
import { EventInputSchema } from '@/schemas/eventSchemas';
import { generateEventPlan } from '@/lib/gemini';
import { handleError, AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { rateLimiter, getClientIdentifier } from '@/lib/rateLimit';
import { responseCache } from '@/lib/cache';
import { validateOrigin } from '@/lib/security';
import { generateOfflineFallbackPlan } from '@/lib/fallbackPlan';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const origin = request.headers.get('origin');
    if (!validateOrigin(origin)) {
      throw new AppError(403, 'Forbidden');
    }

    const clientId = getClientIdentifier(request.headers);
    const rateLimitResult = rateLimiter.check(clientId);

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { clientId });
      throw new AppError(429, 'Too many requests');
    }

    const body = await request.json();
    const validatedInput = EventInputSchema.parse(body);

    logger.info('Generate plan request', {
      eventType: validatedInput.eventType,
      clientId
    });

    const cacheKey = {
      ...validatedInput,
      type: 'generate'
    };
    const cached = responseCache.get(cacheKey);

    if (cached) {
      logger.info('Returning cached response');
      return NextResponse.json(JSON.parse(cached), {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-Cache-Status': 'HIT'
        }
      });
    }

    let plan;
    try {
      plan = await generateEventPlan(validatedInput);
    } catch (error) {
      logger.warn('AI generation failed, using fallback', { error });
      plan = generateOfflineFallbackPlan(validatedInput);
    }

    const response = { success: true, data: plan };
    responseCache.set(cacheKey, JSON.stringify(response));

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-Cache-Status': 'MISS'
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
