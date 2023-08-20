import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export class InvalidDataError extends HttpException {
  constructor(message?: string) {
    super(message || 'invalid-data', 400);
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, error: EntityNotFoundError) {
    super(`Entity ${entity} not found, ${error}`, HttpStatus.NOT_FOUND);
  }
}
