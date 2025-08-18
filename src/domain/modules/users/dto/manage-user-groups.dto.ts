import { UserRole } from '@/core/enums';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';

export class AddUserToGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um papel deve ser fornecido' })
  @IsEnum(UserRole, {
    each: true,
    message: `Cada papel deve ser um dos seguintes: ${Object.values(UserRole).join(', ')}`,
  })
  grupos: UserRole[];
}

export class RemoveUserFromGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um papel deve ser fornecido' })
  @IsEnum(UserRole, {
    each: true,
    message: `Cada papel deve ser um dos seguintes: ${Object.values(UserRole).join(', ')}`,
  })
  grupos: UserRole[];
}

export class SetUserGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um papel deve ser fornecido' })
  @IsEnum(UserRole, {
    each: true,
    message: `Cada papel deve ser um dos seguintes: ${Object.values(UserRole).join(', ')}`,
  })
  grupos: UserRole[];
}
