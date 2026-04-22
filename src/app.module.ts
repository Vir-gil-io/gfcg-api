import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TasksModule } from './modules/tasks/interfaces/tasks.module';
import { UserModule } from './modules/user/interfaces/user.module';
import { LogsModule } from './modules/logs/interfaces/logs.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './common/services/prisma.service';
import { LogsService } from './common/services/logs.service';
import { UtilService } from './common/services/util.service';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    UserModule,
    LogsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    UtilService,
    PrismaService,
    LogsService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
