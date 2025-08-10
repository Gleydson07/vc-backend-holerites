import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/create-auth.dto';
import { NewPasswordChallengeDto } from './dto/new-password-challenge.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.login, signInDto.senha);
  }

  @Public()
  @Post('new-password-challenge') // Necessário quando o método signin retorna NEW_PASSWORD_REQUIRED
  async respondToNewPasswordChallenge(
    @Body() newPasswordChallengeDto: NewPasswordChallengeDto,
  ) {
    return this.authService.respondToNewPasswordChallenge(
      newPasswordChallengeDto.login,
      newPasswordChallengeDto.novaSenha,
      newPasswordChallengeDto.session,
    );
  }
}
