import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  public getAlltasks(): string {
    return 'Obteniendo todas las tareas';
  }
  public getTaskById(id: number): string {
    return `Obteniendo tarea: ${id}`;
  }
  public updateTask(task: any): any {
    return task;
  }
  public insertTask(task: any): any {
    return task;
  }
  public deleteTask(id: number): string {
    return `Eliminando tarea: ${id}`;
  }
}
