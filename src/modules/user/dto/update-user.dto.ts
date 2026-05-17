import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { sanitizeInput } from 'src/common/utils/sanitize.util';

export class UpdateUserDto {
  @Transform(({ value }: { value: string }) =>
    value === '' || value?.trim() === '' ? undefined : sanitizeInput(value),
  )
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    required: false,
  })
  name?: string;

  @Transform(({ value }: { value: string }) =>
    value === '' || value?.trim() === '' ? undefined : sanitizeInput(value),
  )
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(100)
  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    required: false,
  })
  lastname?: string;
}
