import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskModule } from './module/task/task.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { UtilService } from './common/services/util/util.service';
@Module({
  imports: [AuthModule, TasksModule, TaskModule, UserModule],
  controllers: [UserController],
  providers: [UtilService],
})
export class AppModule {}
