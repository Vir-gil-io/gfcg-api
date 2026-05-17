import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { sanitizeInput } from 'src/common/utils/sanitize.util';

export class CreateTaskDto {
  @Transform(({ value }) => sanitizeInput(value))
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la tarea es requerido' })
  @MinLength(3,   { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  name!: string;

  @Transform(({ value }) => sanitizeInput(value))
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  // ✅ Corregido: era 250, la columna en BD es VarChar(200)
  @MaxLength(200, { message: 'La descripción no puede superar 200 caracteres' })
  description!: string;

  @IsNotEmpty({ message: 'La prioridad es requerida' })
  @IsBoolean({ message: 'La prioridad debe ser verdadero o falso' })
  priority!: boolean;
}
