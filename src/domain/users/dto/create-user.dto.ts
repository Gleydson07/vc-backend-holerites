import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserGroups } from '../../../core';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um grupo deve ser fornecido' })
  @IsEnum(UserGroups, {
    each: true,
    message: `Cada grupo deve ser um dos seguintes: ${Object.values(UserGroups).join(', ')}`,
  })
  grupos: UserGroups[];
}
