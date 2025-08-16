import {
  IsString,
  IsNotEmpty,
  Matches,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { UserGroups } from '../../../../core/enums';

export class AddUserToGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um grupo deve ser fornecido' })
  @IsEnum(UserGroups, {
    each: true,
    message: `Cada grupo deve ser um dos seguintes: ${Object.values(UserGroups).join(', ')}`,
  })
  grupos: UserGroups[];
}

export class RemoveUserFromGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um grupo deve ser fornecido' })
  @IsEnum(UserGroups, {
    each: true,
    message: `Cada grupo deve ser um dos seguintes: ${Object.values(UserGroups).join(', ')}`,
  })
  grupos: UserGroups[];
}

export class SetUserGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos um grupo deve ser fornecido' })
  @IsEnum(UserGroups, {
    each: true,
    message: `Cada grupo deve ser um dos seguintes: ${Object.values(UserGroups).join(', ')}`,
  })
  grupos: UserGroups[];
}
