import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilService } from 'src/common/services/util.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { LogsService } from 'src/common/services/logs.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService, LogsService],
})
export class AuthModule {}
