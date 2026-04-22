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
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { updateTaskDto } from '../dto/update-task.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/api/task') //Ruta padre
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private tsksSvc: TasksService) {}
  //! http:localhost:3000/api/task
  @Get()
  async getAllTasks(@Req() request: any) {
    return await this.tsksSvc.getTasksByUser(request['user'].id);
  }

  //! http:localhost:3000/api/task/(id)
  @Get(':id')
  public async listTaskById(
    @Param('id', ParseIntPipe) id: number, //Cuidar parámetros insertados
    @Req() request: any,
  ) {
    const result = await this.tsksSvc.getTaskById(id, request['user'].id);
    if (result == undefined) {
      throw new HttpException(
        `Tarea con ID no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }
    //Siempre regresa un string porque es más volátil y fácil de manejar, aunque se le especifique que es un número. Por eso es necesario convertirlo a número.
    return result;
  }

  @Post() //Los parámetros se especifican en el body de la petición
  public async insertTask(@Body() task: CreateTaskDto, @Req() request: any) {
    const result = this.tsksSvc.insertTask(task, request['user'].id);
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
    @Body() task: updateTaskDto,
    @Req() request: any,
  ) {
    return await this.tsksSvc.updateTask(id, task, request['user'].id);
  }

  @Delete(':id') //El id se especifica en la ruta
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
  ) {
    try {
      await this.tsksSvc.deleteTask(id, request['user'].id);
    } catch (error) {
      throw new HttpException(`Task not found`, HttpStatus.NOT_FOUND);
    }
    return { message: 'Tarea eliminada correctamente' };

    // Documentación en--> nestjs validation
  }
}
