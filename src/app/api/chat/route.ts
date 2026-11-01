import { NextRequest } from 'next/server';
import { ChatMessageSchema } from '@/schemas/eventSchemas';
import { streamChatResponse } from '@/lib/gemini';
import { handleError, AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { rateLimiter, getClientIdentifier } from '@/lib/rateLimit';
import { validateOrigin } from '@/lib/security';

export async function POST(request: NextRequest): Promise<Response> {
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
    const validatedInput = ChatMessageSchema.parse(body);

    logger.info('Chat request', {
      planId: validatedInput.planId,
      clientId
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatResponse(
            validatedInput.message,
            validatedInput.planId,
            validatedInput.language
          )) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          logger.error('Stream error', { error });
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.status,
      headers: errorResponse.headers
    });
  }
}
