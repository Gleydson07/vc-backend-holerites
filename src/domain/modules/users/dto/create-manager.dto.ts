import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateManagerDto {
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
}
