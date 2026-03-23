import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilService {
  constructor(private readonly jwtSvc: JwtService)
  public async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async checkPassword(password: string, encryptedPassword: string) {
    return await bcrypt.compareSync(password, encryptedPassword);
  }

  public async generateJWT(payload: any, expiresIn: any = '60s') {
    return await this.jwtSvc.signAsync(payload, { 
      expiresIn: expiresIn
     });
  }

  public async getPayload(token: string) {
    return await this.jwtSvc.verifyAsync(token);
  }
}
