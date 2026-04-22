import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/common/services/prisma.service';

import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { updateTaskDto } from '../dto/update-task.dto';
import { LogsService } from 'src/common/services/logs.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  // Obtener todas
  async getAlltasks(): Promise<Task[]> {
    return await this.prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Solo tareas del usuario autenticado (aislamiento de recursos)
  async getTasksByUser(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { id: 'asc' },
    });
  }

  // Obtener por ID
  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.user_id !== userId)
      throw new ForbiddenException('No tienes acceso a esta tarea');

    return task;
  }

  // Crear
  async insertTask(data: CreateTaskDto, userId: number): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        priority: data.priority,
        user_id: userId,
      },
    });

    await this.logsService.createLog({
      statusCode: 201,
      path: '/api/task',
      error: '',
      errorCode: 'TASK_CREATED',
      event: `Tarea creada — ID: ${task.id}, Nombre: "${task.name}"`,
      severity: 'INFO',
      session_id: userId,
    });

    return task;
  }

  // Actualizar
  async updateTask(
    id: number,
    data: updateTaskDto,
    userId: number,
  ): Promise<Task> {
    await this.getTaskById(id, userId); // Verifica existencia y permisos

    return await this.prisma.task.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priority: data.priority,
      },
    });
  }

  // Eliminar
  async deleteTask(id: number, userId: number): Promise<Task> {
    await this.getTaskById(id, userId);

    const task = await this.prisma.task.delete({ where: { id } });

    await this.logsService.createLog({
      statusCode: 200,
      path: `/api/task/${id}`,
      error: '',
      errorCode: 'TASK_DELETED',
      event: `Tarea eliminada — ID: ${id}`,
      severity: 'WARNING',
      session_id: userId,
    });

    return task;
  }
}
