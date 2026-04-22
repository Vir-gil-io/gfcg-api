import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { LogsService } from 'src/common/services/logs.service';
import { UtilService } from 'src/common/services/util.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, LogsService, UtilService],
})
export class TasksModule {}
