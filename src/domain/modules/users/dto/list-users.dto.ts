import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { UserGroups } from '../../../../core/enums/user-groups.enum';

export class ListUsersDto {
  @IsEnum(UserGroups, {
    message: `Grupo inválido. Valores permitidos: ${Object.values(UserGroups).join(', ')}.`,
  })
  @IsNotEmpty({ message: 'Grupo é obrigatório' })
  grupo: UserGroups;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
