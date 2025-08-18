import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e no mínimo 6 caracteres',
  })
  password: string;
}
