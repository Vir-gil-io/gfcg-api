import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

// Campos seguros para devolver al cliente (sin password ni hash)
const safeUserSelect = {
  id: true,
  name: true,
  lastname: true,
  username: true,
  role: true,
  created_at: true,
} as const;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async getAllUser() {
    return await this.prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: safeUserSelect,
    });
  }

  public async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  public async updateUser(id: number, userUpdated: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: userUpdated,
      select: safeUserSelect,
    });
  }

  public async insertUser(user: CreateUserDto) {
    return await this.prisma.user.create({
      data: user,
      select: safeUserSelect,
    });
  }

  public async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    if (user.tasks.length > 0)
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );

    return await this.prisma.user.delete({ where: { id } });
  }
}
