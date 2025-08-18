import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthRepository } from '@/domain/repositories/auth/auth.repository';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { FirstAccessChallengeDto } from './dto/first-access-challenge.dto';

@Injectable()
export class FirstAccessChallengeUseCase {
  private readonly logger = new Logger(FirstAccessChallengeUseCase.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: FirstAccessChallengeDto, tenantId: string) {
    const { login, newPassword, session } = data;
    this.logger.log(
      `Iniciando desafio de primeira acesso para o usuário: ${data.login} no tenant ${tenantId}`,
    );

    try {
      const tokenData = await this.authRepository.newPasswordChallenge({
        login,
        newPassword,
        session,
      });
      const userData = await this.userRepository.getUserWithTenants(login);

      if (!userData) {
        this.logger.warn(`Usuário não encontrado: ${login}.`);
        throw new UnauthorizedException('Login ou senha inválidos.');
      }

      let tenantFound:
        | {
            tenantId: string;
            accessProfile: string;
          }
        | undefined = undefined;
      if (userData) {
        if (!userData?.isMaster && !userData.userTenants.length) {
          this.logger.warn(`Usuário não tem vínculo com tenants.`);
          throw new UnauthorizedException('Login ou senha inválidos.');
        }

        if (userData.userTenants.length > 0) {
          tenantFound = userData.userTenants.find(
            (tenant) => tenant.tenantId === tenantId,
          );

          if (!tenantFound) {
            this.logger.warn(`Usuário não encontrado no tenant ${tenantId}.`);
            throw new UnauthorizedException('Login ou senha inválidos.');
          }
        }
      }

      return {
        success: true,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        idToken: tokenData.idToken,
        user: {
          id: userData?.id,
          nickname: userData?.nickname,
          role: tenantFound?.accessProfile,
        },
      };
    } catch (error) {
      this.logger.error('Erro ao realizar login', error);
      throw new UnauthorizedException('Login ou senha inválidos.');
    }
  }
}
