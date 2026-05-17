import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { sanitizeInput } from 'src/common/utils/sanitize.util';

export class CreateUserDto {
  @Transform(({ value }) => sanitizeInput(value))
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  @Matches(/\S/, { message: 'El nombre no puede contener solo espacios' })
  name!: string;

  @Transform(({ value }) => sanitizeInput(value))
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede superar 100 caracteres' })
  @Matches(/\S/, { message: 'El apellido no puede contener solo espacios' })
  lastname!: string;

  // El username no pasa por sanitizeInput completo para conservar puntos y guiones
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().replace(/\s/g, '') : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El usuario no puede superar 50 caracteres' })
  @Matches(/^\S+$/, {
    message: 'El nombre de usuario no puede contener espacios',
  })
  username!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede superar 100 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'La contraseña debe contener: mayúscula, minúscula, número y carácter especial (@$!%*?&)',
    },
  )
  password!: string;
}
