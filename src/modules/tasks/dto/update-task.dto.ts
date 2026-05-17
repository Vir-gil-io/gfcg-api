import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { sanitizeInput } from 'src/common/utils/sanitize.util';

export class updateTaskDto {
  @Transform(({ value }) =>
    value !== undefined ? sanitizeInput(value) : value,
  )
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  @ApiProperty({
    description: 'Nombre de la tarea',
    example: 'Revisar documentación',
  })
  name?: string;

  @Transform(({ value }) =>
    value !== undefined ? sanitizeInput(value) : value,
  )
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
  // ✅ Corregido: alineado con la columna VarChar(200) de la BD
  @MaxLength(200, { message: 'La descripción no puede superar 200 caracteres' })
  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Revisar toda la documentación del módulo',
  })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'La prioridad debe ser verdadero o falso' })
  @ApiProperty({ description: 'Alta prioridad', example: true })
  priority?: boolean;
}
