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
import { request } from 'http';
import { AppException } from 'src/common/exceptions/app.exception';
import { hash } from 'crypto';

@Controller('api/auth') //Ruta padre
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService,
  ) {}
  @Post('/login') //Pueden haber varias rutas, pero no es recomendable. Ruta hija
  @HttpCode(HttpStatus.OK) //Cambiar el código de respuesta, por defecto es 201 Created
  public async login(@Body() login: LoginDto): Promise<any> {
    const { username, password } = login;

    // Verificar el usuario y contraseña
    const user = await this.authSvc.getUserByUsername(username);
    if (!user)
      throw new UnauthorizedException(
        'El usuario y/o contraseña es incorrecto',
      );

    if (await this.utilSvc.checkPassword(password, user.password!)) {
      // Obtener la información del usuario (payload)
      const payload = {
        id: user.id,
        name: user.name,
        username: user.username,
        hash: user.hash, //pasarlo a utils
      };

      //  Generar el JWT
      const access_token = await this.utilSvc.generateJWT(payload, '1h');

      //Generar el refreshToken
      const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
      const hashRT = await this.utilSvc.hash(refresh_token);

      //Asignar el hash al usuario
      await this.authSvc.updateHash(user.id, hashRT);
      payload.hash = hashRT;

      // Devolever el JWT encriptado
      return {
        access_token,
        refresh_token, //: hashRT,
      };
    } else {
      throw new UnauthorizedException(
        'El usuario y/o contraseña es incorrecto',
      );
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    const user = request['user'];
    return user;
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    //obtener el usuario en sesión
    const sessionUser = request['user'];
    const user = await this.authSvc.getUserById(sessionUser.id);
    if (!user || !user.hash)
      throw new AppException('Token inválido', HttpStatus.FORBIDDEN, '2');
    //throw new ForbiddenException('Acceso Denegado');

    //Comparar el token recibido con el token guardado
    if (sessionUser.hash != user.hash)
      throw new ForbiddenException('Token inválido');

    //FIXME: Si el oken es válido se generan nuevos token's
    return {
      access_token: '',
      refreshToken: '',
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const session = request['user'];
    const user = await this.authSvc.updateHash(session.id, null);
    return user;
  }
}

//nest g (generate) --help para ver los comandos de generación disponibles, así como sus opciones
//Usage: nest generate|g [options] <schematic> [name] [path]
