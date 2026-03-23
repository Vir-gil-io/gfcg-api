import { Controller, UseGuards } from '@nestjs/common';
import { UtilService } from 'src/common/services/util.service';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
   private utilService: UtilService,
   private userService: UserService,
  ) {}
  
  //Poner en el insert
  //encryptedPassword = await this.utilSvc.hashPassword(user.password);
  //user.password = encryptedPassword;
}
