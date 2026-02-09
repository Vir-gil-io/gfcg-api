import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskModule } from './module/task/task.module';
@Module({
  imports: [AuthModule, TasksModule, TaskModule],
})
export class AppModule {}
