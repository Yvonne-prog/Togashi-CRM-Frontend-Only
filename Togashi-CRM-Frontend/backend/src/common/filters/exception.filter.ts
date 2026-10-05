import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface SupabasePgError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

function isSupabaseError(error: unknown): error is SupabasePgError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function safeErrorInfo(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== 'object') {
    return { raw: String(error) };
  }
  const e = error as Record<string, unknown>;
  const stack: string | undefined =
    typeof e['stack'] === 'string' ? (e['stack'] as string).split('\n').slice(0, 8).join('\n') : undefined;
  return {
    name: e['name'],
    message: e['message'],
    code: e['code'],
    details: e['details'],
    hint: e['hint'],
    stack,
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    const errors: string[] = [];

    try {
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        code = `HTTP_${status}`;
        const body = exception.getResponse();

        if (typeof body === 'object' && body !== null) {
          const resp = body as Record<string, unknown>;
          message = (resp.message as string) ?? exception.message;
          if (Array.isArray(resp.errors)) {
            errors.push(...(resp.errors as string[]));
          } else if (Array.isArray(resp.message)) {
            errors.push(...(resp.message as string[]));
            message = 'Validation failed';
          }
          if (resp.code && typeof resp.code === 'string') {
            code = resp.code;
          }
        } else {
          message = exception.message;
        }

        this.logger.error(
          `HttpException on ${request.method} ${request.url}: ${message}`,
          safeErrorInfo(exception),
        );
      } else if (isSupabaseError(exception)) {
        code = exception.code ?? 'SUPABASE_ERROR';
        message = exception.message ?? 'Database error';

        this.logger.error(
          `Supabase error on ${request.method} ${request.url}: ${message}`,
          {
            name: exception.constructor?.name,
            code: exception.code,
            details: exception.details,
            hint: exception.hint,
          },
        );

        if (exception.code) {
          errors.push(exception.code);
        }
      } else if (exception instanceof Error) {
        const safe = safeErrorInfo(exception);
        code = 'UNHANDLED_ERROR';

        this.logger.error(
          `Unhandled error on ${request.method} ${request.url}: ${exception.message}`,
          safe,
        );

        message = exception.message || message;
      } else {
        const safe = safeErrorInfo(exception);
        code = 'UNKNOWN_ERROR';

        this.logger.error(
          `Unknown error on ${request.method} ${request.url}`,
          safe,
        );
      }
    } catch (filterError) {
      const safe = safeErrorInfo(filterError);
      this.logger.error('Exception filter itself threw', safe);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'FILTER_ERROR';
    }

    if (response.headersSent) {
      this.logger.error(
        `Headers already sent for ${request.method} ${request.url} — cannot write error response`,
      );
      return;
    }

    const body: Record<string, unknown> = {
      success: false,
      message,
      code,
      errors,
    };

    try {
      response.status(status).json(body);
    } catch (serializeError) {
      this.logger.error('Failed to serialize error response', safeErrorInfo(serializeError));
      if (!response.headersSent) {
        response.status(status).json({
          success: false,
          message: 'Internal server error',
          code: 'SERIALIZATION_ERROR',
          errors: [],
        });
      }
    }
  }
}
