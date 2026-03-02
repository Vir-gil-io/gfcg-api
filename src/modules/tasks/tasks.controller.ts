import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('/api/task') //Ruta padre
export class TasksController {
  constructor(private tsksSvc: TasksService) {}
  //! http:localhost:3000/api/task
  @Get()
  async getAllTasks(): Promise<Task[]> {
    return await this.tsksSvc.getAlltasks();
  }

  //! http:localhost:3000/api/task/(id)
  @Get(':id')
  public async listTaskById(
    @Param('id', ParseIntPipe) id: number, //Cuidar parámetros insertados
  ): Promise<Task> {
    const result = await this.tsksSvc.getTaskById(id);
    console.log('Tipo de dato:', typeof result);
    if (result == undefined) {
      throw new HttpException(
        `Tarea con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }
    //Siempre regresa un string porque es más volátil y fácil de manejar, aunque se le especifique que es un número. Por eso es necesario convertirlo a número.
    return result;
  }

  @Post() //Los parámetros se especifican en el body de la petición
  public async insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.tsksSvc.insertTask(task);
    if (result == undefined) {
      throw new HttpException(
        `Tarea no registrada`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Put(':id') //Los parámetros se especifican en el body de la petición, pero el id se especifica en la ruta
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tsksSvc.updateTask(id, task);
  }

  @Delete(':id') //El id se especifica en la ruta
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const result = await this.tsksSvc.deleteTask(id);
    if (!result) {
      throw new HttpException(
        'No se pudo eliminar la tarea',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;

    // Documentación en--> nestjs validation
  }
}
