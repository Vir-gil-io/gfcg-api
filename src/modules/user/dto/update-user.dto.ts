import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: 'Nombre', example: 'Juan' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: 'Apellido', example: 'Pérez' })
  lastname?: string;
}
