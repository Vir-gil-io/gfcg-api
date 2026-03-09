import { Task } from 'src/modules/tasks/entities/task.entity';

export class User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  password: string;
  tasks: Task[];
}
