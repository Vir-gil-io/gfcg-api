import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../../../generated/prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
@Controller('api/user')
export class UserController {
  constructor(
    private userSvc: UserService,
    private readonly utilSvc: UtilService,
  ) {}

  //! http: localhost: 3000/api/user
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN') //solo el admin puede ver la lista de usuarios
  async getAllUser() {
    //es importante especificar que tipo de dato se esta retornando
    return await this.userSvc.getAllUser();
  }

  //! http: localhost: 3000/api/user/1
  //depende de cuantos parametros se envian para poder obtener la ruta del get que debe de ser diferente, ninguna puede ser igual
  @Get(':id') //lo adecuado es indicar que tipo de valor es
  @UseGuards(AuthGuard)
  public async listUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
  ) {
    const sessionUser = request['user'];
    if (sessionUser.role !== 'ADMIN' && sessionUser.id !== id)
      throw new ForbiddenException('No puedes ver el perfil de otro usuario');

    return await this.userSvc.getUserById(id);
  }

  // Registro abierto (sin autenticación)
  @Post()
  public async insertUser(@Body() user: CreateUserDto) {
    user.password = await this.utilSvc.hashPassword(user.password);
    return await this.userSvc.insertUser(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() request: any,
  ) {
    const sessionUser = request['user'];
    if (sessionUser.role !== 'ADMIN' && sessionUser.id !== id)
      throw new ForbiddenException(
        'No puedes editar el perfil de otro usuario',
      );

    return await this.userSvc.updateUser(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userSvc.deleteUser(id);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuario eliminado correctamente' };
  }
}
