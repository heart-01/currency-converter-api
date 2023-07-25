import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { handleErrorMessage } from './handle-error-message';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = exception['status'];
    let message = exception['message'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        message = exceptionResponse.message;
      }
    } else if (exception instanceof Error) {
      const errorMessage = handleErrorMessage(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception['response'] && exception['response'].status)
        status = exception['response'].data.message;
      message = errorMessage;
    }

    this.logger.error(message);

    response.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
