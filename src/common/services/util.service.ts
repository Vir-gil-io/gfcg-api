import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {
  constructor(private readonly jwtSvc: JwtService) {}

  // Método genérico hash
  public async hash(text: string): Promise<string> {
    return await bcrypt.hash(text, 10);
  }

  // Hash password
  public async hashPassword(password: string): Promise<string> {
    return await this.hash(password);
  }

  // Comparar password
  public async checkPassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }

  // Generar JWT
  public async generateJWT(
    payload: any,
    expiresIn: any = '1h',
  ): Promise<string> {
    return await this.jwtSvc.signAsync(payload, {
      expiresIn,
    });
  }

  // Leer payload
  public async getPayload(token: string): Promise<any> {
    return await this.jwtSvc.verifyAsync(token);
  }
}
