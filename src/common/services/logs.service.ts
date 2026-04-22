import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface CreateLogDto {
  statusCode: number;
  path: string;
  error: string;
  errorCode: string;
  event?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  session_id?: number | null;
}

export interface QueryLogsDto {
  from?: string;
  to?: string;
  userId?: string;
  severity?: string;
  event?: string;
}

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: CreateLogDto): Promise<void> {
    try {
      await this.prisma.logs.create({
        data: {
          statusCode: data.statusCode,
          timeStamp: new Date(),
          path: data.path,
          error: data.error,
          errorCode: data.errorCode,
          event: data.event ?? null,
          severity: data.severity ?? 'INFO',
          session_id: data.session_id ?? null,
        },
      });
    } catch (err) {
      // No interrumpir el flujo principal si falla el log
      console.error('[LogsService] Error al guardar log:', err);
    }
  }

  async getLogs(filters: QueryLogsDto) {
    const where: any = {};

    if (filters.from || filters.to) {
      where.timeStamp = {};
      if (filters.from) where.timeStamp.gte = new Date(filters.from);
      if (filters.to) where.timeStamp.lte = new Date(filters.to);
    }

    if (filters.userId) where.session_id = parseInt(filters.userId);
    if (filters.severity) where.severity = filters.severity.toUpperCase();
    if (filters.event)
      where.event = { contains: filters.event, mode: 'insensitive' };

    return await this.prisma.logs.findMany({
      where,
      orderBy: { timeStamp: 'desc' },
      take: 200,
      include: {
        user: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });
  }
}
