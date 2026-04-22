import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/common/services/prisma.service';

import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { updateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas
  async getAlltasks(): Promise<Task[]> {
    return await this.prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Obtener por ID
  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    return task;
  }

  // Crear
  async insertTask(data: CreateTaskDto): Promise<Task> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.user_id,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario no existe');
    }

    return await this.prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        priority: data.priority,
        user_id: data.user_id,
      },
    });
  }

  // Actualizar
  async updateTask(id: number, data: updateTaskDto): Promise<Task> {
    await this.getTaskById(id);

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
  async deleteTask(id: number): Promise<Task> {
    await this.getTaskById(id);

    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
