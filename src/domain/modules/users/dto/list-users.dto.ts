import { UserRole } from '@/core/enums';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export class ListUsersDto {
  @IsEnum(UserRole, {
    message: `Papel inválido. Valores permitidos: ${Object.values(UserRole).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'Papel é obrigatório' })
  papel: UserRole;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
