import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserAdminDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+\d{8,15}$/, {
    message: 'O telefone deve estar no formato +5511912345678',
  })
  phone?: string;
}
