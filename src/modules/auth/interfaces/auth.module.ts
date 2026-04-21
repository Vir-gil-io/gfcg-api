import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilService } from 'src/common/services/util.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService],
})
export class AuthModule {}
