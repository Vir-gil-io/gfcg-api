import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { pgProvider } from 'src/common/providers/pg.provider';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, pgProvider, PrismaService],
})
export class TasksModule {}
