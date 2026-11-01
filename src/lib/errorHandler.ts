import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleError(error: unknown): NextResponse {
  logger.error('Error occurred', { error });

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Unknown error occurred' },
    { status: 500 }
  );
}
