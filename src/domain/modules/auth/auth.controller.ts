import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { TenantId } from './decorators/tenant-id.decorator';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { SignInDto } from './usecases/dto/sign-in.dto';
import { FirstAccessChallengeUseCase } from './usecases/first-access-challenge.usecase';
import { FirstAccessChallengeDto } from './usecases/dto/first-access-challenge.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly firstAccessChallengeUseCase: FirstAccessChallengeUseCase,
  ) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @TenantId() tenantId: string) {
    return this.signInUseCase.execute(signInDto, tenantId);
  }

  @Public()
  @Post('challenge')
  async respondToNewPasswordChallenge(
    @Body() firstAccessChallengeDto: FirstAccessChallengeDto,
    @TenantId() tenantId: string,
  ) {
    return this.firstAccessChallengeUseCase.execute(
      firstAccessChallengeDto,
      tenantId,
    );
  }
}
