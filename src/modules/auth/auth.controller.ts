import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth') //Ruta padre
export class AuthController {
  constructor(private authSvc: AuthService) {}
  @Post('/login') //Pueden haber varias rutas, pero no es recomendable. Ruta hija
  @HttpCode(HttpStatus.OK) //Cambiar el código de respuesta, por defecto es 201 Created
  public login(@Body() loginDto: LoginDto): string {
    const { username, password } = loginDto;

    // ToDo: Verificar el usuario y contraseña

    // ToDo: Obtener la información del usuario (payload)
    
    // ToDo: Generar el JWT
    
    // ToDo: Devolever el JWT encriptado
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
