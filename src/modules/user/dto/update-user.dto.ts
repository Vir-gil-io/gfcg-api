import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @Min(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: '', example: '' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @Min(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: '', example: '' })
  lastname?: string;
}
