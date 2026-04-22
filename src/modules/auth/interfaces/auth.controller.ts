import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppException } from 'src/common/exceptions/app.exception';
import { LogsService } from 'src/common/services/logs.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
    private readonly logsService: LogsService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: LoginDto): Promise<any> {
    const { username, password } = login;

    const user = await this.authSvc.getUserByUsername(username);

    if (!user) {
      await this.logsService.createLog({
        statusCode: 401,
        path: '/api/auth/login',
        error: 'Usuario no encontrado',
        errorCode: 'LOGIN_FAILED',
        event: `Login fallido — usuario inexistente: ${username}`,
        severity: 'WARNING',
        session_id: null,
      });
      throw new UnauthorizedException(
        'El usuario y/o contraseña es incorrecto',
      );
    }

    const isValid = await this.utilSvc.checkPassword(password, user.password!);

    if (!isValid) {
      await this.logsService.createLog({
        statusCode: 401,
        path: '/api/auth/login',
        error: 'Contraseña incorrecta',
        errorCode: 'LOGIN_FAILED',
        event: `Login fallido — contraseña incorrecta para: ${username}`,
        severity: 'WARNING',
        session_id: user.id,
      });
      throw new UnauthorizedException(
        'El usuario y/o contraseña es incorrecto',
      );
    }

    // Generar hash de sesión ANTES de crear el payload
    const sessionHash = await this.utilSvc.hash(
      `${user.id}-${user.username}-${Date.now()}`,
    );
    await this.authSvc.updateHash(user.id, sessionHash);

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    const access_token = await this.utilSvc.generateJWT(payload, '1h');
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');

    return { access_token, refresh_token };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    const { id, name, username, role } = request['user'];
    return { id, name, username, role };
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    const sessionUser = request['user'];
    const user = await this.authSvc.getUserById(sessionUser.id);

    if (!user || !user.hash)
      throw new AppException(
        'Token inválido',
        HttpStatus.FORBIDDEN,
        'TOKEN_INVALID',
      );

    if (sessionUser.hash !== user.hash)
      throw new ForbiddenException('Token inválido o sesión expirada');

    // Rotar sesión
    const sessionHash = await this.utilSvc.hash(
      `${user.id}-${user.username}-${Date.now()}`,
    );
    await this.authSvc.updateHash(user.id, sessionHash);

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.utilSvc.generateJWT(payload, '1h'),
      refresh_token: await this.utilSvc.generateJWT(payload, '7d'),
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const session = request['user'];
    await this.authSvc.updateHash(session.id, null);
  }
}

//nest g (generate) --help para ver los comandos de generación disponibles, así como sus opciones
//Usage: nest generate|g [options] <schematic> [name] [path]
