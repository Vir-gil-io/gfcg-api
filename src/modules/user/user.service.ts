import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('POSTGRES_CONNECTION') private pg: Client,
    private prisma: PrismaService,
  ) {}
  public async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      //Puede limitarse la información mostrada desde el servicio, por ejemplo, para no mostrar la contraseña de los usuarios:
      //select: { id: true, name: true, username: true }
    });
    return users as User[];
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return user as User;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user as User;
  }

  public async insertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: { user },
    });
    return newUser as User;
  }

  public async updateUser(
    id: number,
    userUpdated: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { userUpdated },
    });
    return user as User;
  }

  public async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
        where { id: id },
    });
    return user as User;
  }
}
