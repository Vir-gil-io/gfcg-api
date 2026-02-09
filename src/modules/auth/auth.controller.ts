import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth') //Ruta padre
export class AuthController {
  constructor(private authSvc: AuthService) {}
  @Get() //Pueden haber varias rutas, pero no es recomendable. Ruta hija
  public login(): string {
    return this.authSvc.login();
  }
}

//nest g (generate) --help para ver los comandos de generación disponibles, así como sus opciones
//Usage: nest generate|g [options] <schematic> [name] [path]
