import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/create-auth.dto';
import { NewPasswordChallengeDto } from './dto/new-password-challenge.dto';
import { Public } from './decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.cpf, signInDto.senha);
  }

  @Public()
  @Post('new-password-challenge') // Necessário quando o método signin retorna NEW_PASSWORD_REQUIRED
  async respondToNewPasswordChallenge(
    @Body() newPasswordChallengeDto: NewPasswordChallengeDto,
  ) {
    return this.authService.respondToNewPasswordChallenge(
      newPasswordChallengeDto.cpf,
      newPasswordChallengeDto.novaSenha,
      newPasswordChallengeDto.session,
    );
  }
}
