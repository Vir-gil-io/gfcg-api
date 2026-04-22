import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../../generated/prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Client } from 'pg';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async getAllUser(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
      },
    });

    return users;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  public async updateUser(
    id: number,
    userUpdated: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdated,
    });

    return user;
  }

  public async insertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user,
    });

    return newUser;
  }

  public async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.tasks && user.tasks.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );
    }

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
