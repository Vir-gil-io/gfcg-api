import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @Transform(({ value }: { value: string }) =>
    value === '' || value?.trim() === '' ? undefined : value?.trim(),
  )
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: 'Nombre', example: 'Juan' })
  name?: string;

  @Transform(({ value }: { value: string }) =>
    value === '' || value?.trim() === '' ? undefined : value?.trim(),
  )
  @IsOptional()
  @IsString({ message: 'Debe ser una cadena' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({ description: 'Apellido', example: 'Pérez' })
  lastname?: string;
}
