import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { timestamp } from 'rxjs';
import { LogsService } from '../services/logs.service';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const errorMessage =
      typeof rawMessage === 'string'
        ? rawMessage
        : ((rawMessage as any).message ?? 'Error interno del servidor');

    const errorCode =
      (exception as any).errorCode ??
      (exception as any).code ??
      'UNKNOWN_ERROR';

    const sessionUser = (request as any)['user'];

    // Guardar en base de datos
    await this.logsService.createLog({
      statusCode: status,
      path: request.url,
      error: errorMessage,
      errorCode,
      event: 'HTTP_ERROR',
      severity: status >= 500 ? 'ERROR' : 'WARNING',
      session_id: sessionUser?.id ?? null,
    });

    //respuesta del servidor
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
      errorCode,
    });
  }
}
