import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UtilService } from 'src/common/services/util.service';
import { pgProvider } from 'src/common/providers/pg.provider';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, PrismaService, UtilService, pgProvider],
  controllers: [UserController],
})
export class UserModule {}
