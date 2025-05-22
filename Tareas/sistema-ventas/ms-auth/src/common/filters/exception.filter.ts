import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : exception instanceof QueryFailedError 
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const defaultMessage = this.getDefaultMessage(status);
    const details = this.getErrorDetails(exception);
    console.log("Excepcion: ",exception);

    response.status(status).json({
      status: false,
      statusCode: status,
      message: defaultMessage,
      error: {
        details: details
      }
    });
  }

  private getDefaultMessage(status: number): string {
    const messages = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      500: 'Internal Server Error'
    };
    return messages[status] || 'Error';
  }

  private getErrorDetails(exception: any): string[] {
    if (Array.isArray(exception.response?.message)) {
      return exception.response.message;
    }

    if (exception.response?.message) {
      return [exception.response.message];
    }

    if (exception.message && exception.detail) {
      return [exception.message, exception.detail];
    }

    if (exception.message){
      return [exception.message]
    }

    return ['An error occurred'];
  }
}