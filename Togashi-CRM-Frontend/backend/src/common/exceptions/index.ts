import { HttpException } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message: string) {
    super({ success: false, message, errors: [message] }, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super({ success: false, message, errors: [message] }, 403);
  }
}

export class NotFoundException extends HttpException {
  constructor(resource: string) {
    const message = `${resource} not found`;
    super({ success: false, message, errors: [message] }, 404);
  }
}

export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super({ success: false, message: 'Validation failed', errors }, 422);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super({ success: false, message, errors: [message] }, 409);
  }
}
