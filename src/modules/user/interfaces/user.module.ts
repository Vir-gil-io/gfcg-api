import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UtilService } from 'src/common/services/util.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, PrismaService, UtilService],
  controllers: [UserController],
})
export class UserModule {}
