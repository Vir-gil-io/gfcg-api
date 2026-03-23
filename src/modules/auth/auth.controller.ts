import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UtilService } from 'src/common/services/util.service';

@Controller('api/auth') //Ruta padre
export class AuthController {
  constructor(private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) {}
  @Post('/login') //Pueden haber varias rutas, pero no es recomendable. Ruta hija
  @HttpCode(HttpStatus.OK) //Cambiar el código de respuesta, por defecto es 201 Created
  public async login(@Body() login: LoginDto): Promise<any> {
    const { username, password } = login;

    // Verificar el usuario y contraseña
    const user = await this.authSvc.getUserByUsername(username);
    if (!user)
      throw new UnauthorizedException('El usuario y/o contraseña es incorrecto')

    if (await this.utilSvc.checkPassword(password, user.password!)){
      // Obtener la información del usuario (payload)
      const { password, username, ...payload} = user;
    
    //  Generar el JWT
    const access_token = await this.utilSvc.generateJWT(payload);

    //Generar el refreshToken
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');

    // Devolever el JWT encriptado
    return{
      access_token,
      refresh_token
    }
    }else{
    throw new UnauthorizedException('El usuario y/o contraseña es incorrecto')

    }
    
    return this.authSvc.login();
  }
}

//POST /auth/register - 201 Created

@Get('/me')
public getProfile() {
  
}

@Post()
public refreshToken() {
  
}

@Post('/logout')
public logout() {
  
}

//nest g (generate) --help para ver los comandos de generación disponibles, así como sus opciones
//Usage: nest generate|g [options] <schematic> [name] [path]
