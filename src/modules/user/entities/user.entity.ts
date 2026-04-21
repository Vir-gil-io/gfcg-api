import { Task } from 'src/modules/tasks/entities/task.entity';

export class User {
  id!: number;
  name!: string;
  lastname!: string;
  username!: string;
  hash?: string | null | undefined;
  password?: string;
  tasks: Task[] = [];
  created_at!: Date;
}
