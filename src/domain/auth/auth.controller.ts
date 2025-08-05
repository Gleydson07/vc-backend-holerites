import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/create-auth.dto';
import { NewPasswordChallengeDto } from './dto/new-password-challenge.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.cpf, signInDto.senha);
  }

  @Post('new-password-challenge')
  async respondToNewPasswordChallenge(
    @Body() newPasswordChallengeDto: NewPasswordChallengeDto,
  ) {
    return this.authService.respondToNewPasswordChallenge(
      newPasswordChallengeDto.cpf,
      newPasswordChallengeDto.novaSenha,
      newPasswordChallengeDto.session,
    );
  }

  @Post('admin/create-user')
  async adminCreateUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.adminCreateUser(
      createUserDto.cpf,
      createUserDto.email || null,
      createUserDto.nome,
    );
  }
}
