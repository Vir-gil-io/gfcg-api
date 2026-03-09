import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString({message: 'Debe ser una cadena'})
  @MinLength(3,{
    message?: 'Debe tener al menos 3 caracteres',
  })
  @MaxLength(100)
  @ApiProperty({ description: '', example: ''})
  name?: string;
  @IsOptional()
  @IsString({message: 'Debe ser una cadena'})
  @MinLength(3,{
    message: 'Debe tener al menos 3 caracteres',
  })
  @MaxLength(100)
  @ApiProperty({ description: '', example: ''})
  description?: string;
  
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '', example: ''})
  priority?: boolean;
}
