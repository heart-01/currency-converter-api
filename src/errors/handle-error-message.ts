import { Logger } from '@nestjs/common';

export function handleErrorMessage(exception: Error): string | null {
  if (parseInt(exception['code']) === 23505 && exception['table'] === 'user') {
    return 'Error, because this username already exists!';
  }

  if (parseInt(exception['code']) === 23514 && exception['table'] === 'user') {
    return 'role is invalid';
  }

  let message = exception.message;
  if (exception['response'] && exception['response'].data.message)
    message = exception['response'].data.message;

  return message;
}
