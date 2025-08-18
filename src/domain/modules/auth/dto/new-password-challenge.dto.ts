import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class NewPasswordChallengeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login(CPF) deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Nova senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e no mínimo 6 caracteres',
  })
  novaSenha: string;

  @IsString()
  @IsNotEmpty()
  session: string;
}
