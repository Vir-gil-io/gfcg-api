import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../../../generated/prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/user')
export class UserController {
  constructor(
    private userSvc: UserService,
    private readonly utilSvc: UtilService,
  ) {}

  //! http: localhost: 3000/api/user
  @Get()
  async getAllUser(): Promise<User[]> {
    //es importante especificar que tipo de dato se esta retornando
    return await this.userSvc.getAllUser();
  }

  //! http: localhost: 3000/api/user/1
  //depende de cuantos parametros se envian para poder obtener la ruta del get que debe de ser diferente, ninguna puede ser igual
  @Get(':id') //lo adecuado es indicar que tipo de valor es
  public async listUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    const result = await this.userSvc.getUserById(id);
    console.log('Tipo de dato: ', typeof result);

    if (result == undefined)
      throw new HttpException(
        `Usuario con ID no encontrado`,
        HttpStatus.NOT_FOUND,
      ); //mensaje de error por HTTP, con mensaje personalizado

    return result;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateUserDto,
  ): Promise<User> {
    return await this.userSvc.updateUser(id, task);
  }

  @Post() //el insert se debe de enviar por medio del body, por si solo no se puede enviar datos
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    //@Body es un decorator, siempre inician con un @
    const encryptedPassword = await this.utilSvc.hash(user.password);

    user.password = encryptedPassword;

    const result = await this.userSvc.insertUser(user);

    if (result == undefined)
      throw new HttpException(
        'Usuario no registrado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return result;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    try {
      await this.userSvc.deleteUser(id);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
