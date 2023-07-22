import { HttpException } from '@nestjs/common';

export class InvalidDataError extends HttpException {
  constructor(message?: string) {
    super(message || 'invalid-data', 400);
  }
}
