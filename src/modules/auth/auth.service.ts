import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { username }
    });
  }
}
