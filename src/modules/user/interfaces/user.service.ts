import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '../../../../generated/prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Client } from 'pg';

@Injectable()
export class UserService {
  constructor(
    @Inject('POSTGRES_CONNECTION')
    private pg: Client,

    private prisma: PrismaService,
  ) {}

  public async getAllUser(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        lastname: true,
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
        created_at: true,
      },
    });

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
      include: { task: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.task && user.task.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );
    }

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
