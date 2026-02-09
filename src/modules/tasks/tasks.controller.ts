import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('/api/task') //Ruta padre
export class TasksController {
  constructor(private tsksSvc: TasksService) {}
    //! http:localhost:3000/api/task
  @Get()
  getAllTasks(): string {
    return this.tsksSvc.getAlltasks();
  }

  //! http:localhost:3000/api/task/(id)
  @Get(':id')
  public listTaskById(@Param('id') id: string) {
    //Siempre regresa un string porque es más volátil y fácil de manejar, aunque se le especifique que es un número. Por eso es necesario convertirlo a número.
    return this.tsksSvc.getTaskById(parseInt(id));
  }

  @Post() //Los parámetros se especifican en el body de la petición
  public insertTask(task: any) {
    return this.tsksSvc.insertTask(task);
  }

  @Put(':id') //Los parámetros se especifican en el body de la petición, pero el id se especifica en la ruta
  public updateTask(id: number, task: any) {
    return this.tsksSvc.updateTask(task);
  }

  @Delete(':id')//El id se especifica en la ruta
  public deleteTask(id: number) {
    return this.tsksSvc.deleteTask(id);
  }
}
