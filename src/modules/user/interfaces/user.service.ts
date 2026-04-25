import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { LogsService } from 'src/common/services/logs.service';
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
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

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

  public async insertUser(user: CreateUserDto, adminId: number) {
    const newUser = await this.prisma.user.create({
      data: user,
      select: safeUserSelect,
    });

    await this.logsService.createLog({
      statusCode: 201,
      path: '/api/user',
      error: '',
      errorCode: 'USER_CREATED',
      event: `Usuario creado — username: "${newUser.username}", rol: ${newUser.role}`,
      severity: 'INFO',
      session_id: adminId,
    });

    return newUser;
  }

  public async deleteUser(id: number, adminId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    if (user.tasks.length > 0)
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene tareas asignadas',
      );

    const deleted = await this.prisma.user.delete({ where: { id } });

    // Auditoría: registro de eliminación de usuario
    await this.logsService.createLog({
      statusCode: 200,
      path: `/api/user/${id}`,
      error: '',
      errorCode: 'USER_DELETED',
      event: `Usuario eliminado — username: "${user.username}", rol: ${user.role}`,
      severity: 'WARNING',
      session_id: adminId,
    });

    return deleted;
  }

  public async changeRole(targetId: number, newRole: string, adminId: number) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });
    if (!target) throw new NotFoundException('Usuario no encontrado');

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { role: newRole },
      select: safeUserSelect,
    });

    // Auditoría: cambio de rol
    await this.logsService.createLog({
      statusCode: 200,
      path: `/api/user/${targetId}/role`,
      error: '',
      errorCode: 'ROLE_CHANGED',
      event: `Cambio de rol — usuario: "${target.username}" | ${target.role} → ${newRole}`,
      severity: 'WARNING',
      session_id: adminId,
    });

    return updated;
  }
}
