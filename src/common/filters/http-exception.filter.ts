import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../services/logs.service';

// Códigos de error de Prisma más comunes
const PRISMA_ERROR_MESSAGES: Record<
  string,
  { status: number; message: string }
> = {
  P2000: {
    status: 400,
    message: 'Uno o más campos superan la longitud máxima permitida.',
  },
  P2001: { status: 404, message: 'El recurso solicitado no existe.' },
  P2002: {
    status: 409,
    message: 'Ya existe un registro con ese valor. Elige uno diferente.',
  },
  P2003: { status: 400, message: 'Referencia inválida entre registros.' },
  P2025: { status: 404, message: 'El registro no fue encontrado.' },
};

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    let userMessage =
      typeof rawMessage === 'string'
        ? rawMessage
        : ((rawMessage as any).message ?? 'Error interno del servidor');

    // Código interno — solo para logs, NUNCA se envía al cliente
    let internalCode =
      (exception as any).errorCode ??
      (exception as any).code ??
      'UNKNOWN_ERROR';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const raw = exception.getResponse();
      userMessage =
        typeof raw === 'string' ? raw : ((raw as any).message ?? userMessage);
      internalCode = (exception as any).errorCode ?? 'HTTP_EXCEPTION';
    } else if (exception?.code && PRISMA_ERROR_MESSAGES[exception.code]) {
      // Error conocido de Prisma → respuesta limpia al cliente
      const prismaInfo = PRISMA_ERROR_MESSAGES[exception.code];
      status = prismaInfo.status;
      userMessage = prismaInfo.message;
      internalCode = `PRISMA_${exception.code}`;
    } else if (
      exception?.name === 'PrismaClientKnownRequestError' ||
      exception?.name === 'PrismaClientUnknownRequestError' ||
      exception?.name === 'PrismaClientValidationError'
    ) {
      // Error de Prisma no mapeado → 400 genérico sin detalles internos
      status = HttpStatus.BAD_REQUEST;
      userMessage =
        'Los datos enviados no son válidos o superan los límites permitidos.';
      internalCode = `PRISMA_${exception.name}`;
    }

    const sessionUser = (request as any)['user'];

    // Guardar en base de datos
    await this.logsService.createLog({
      statusCode: status,
      path: request.url,
      error: userMessage,
      errorCode: internalCode,
      event: 'HTTP_ERROR',
      severity: status >= 500 ? 'ERROR' : 'WARNING',
      session_id: sessionUser?.id ?? null,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: userMessage,
    });
  }
}
