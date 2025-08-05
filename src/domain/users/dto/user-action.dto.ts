import { IsString, IsNotEmpty, Matches, IsBoolean } from 'class-validator';

export class UserActionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf: string;
}

export class UserStatusDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf: string;

  @IsBoolean()
  enabled: boolean;
}
