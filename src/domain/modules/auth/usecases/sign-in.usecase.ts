import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthRepository } from '@/domain/repositories/auth/auth.repository';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignInUseCase {
  private readonly logger = new Logger(SignInUseCase.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: SignInDto, tenantId: string) {
    const { login, password } = data;
    this.logger.log(
      `Iniciando login para o usuário: ${data.login} no tenant ${tenantId}`,
    );

    try {
      const tokenData = await this.authRepository.getToken({
        login,
        password,
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
        const userEnvProviderId = this.configService.get<string>(
          'MASTER_USER_PROVIDER_ID',
        );

        if (
          !(userData?.userProviderId === userEnvProviderId) &&
          !userData.userTenants.length
        ) {
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

      if (tokenData.authenticationResult?.accessToken) {
        this.logger.log(`Login bem-sucedido para o usuário: ${login}`);

        return {
          success: true,
          accessToken: tokenData.authenticationResult.accessToken,
          refreshToken: tokenData.authenticationResult.refreshToken,
          idToken: tokenData.authenticationResult.idToken,
          user: {
            id: userData?.id,
            nickname: userData?.nickname,
            role: tenantFound?.accessProfile,
          },
        };
      }

      if (tokenData?.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.logger.log(
          `Desafio de nova senha necessário para o usuário: ${login}`,
        );

        return {
          success: false,
          challengeName: 'NEW_PASSWORD_REQUIRED',
          session: tokenData.session,
        };
      }

      throw new UnauthorizedException('Processo de autenticação inesperado.');
    } catch (error) {
      this.logger.error('Erro ao realizar login', error);
      throw new UnauthorizedException('Login ou senha inválidos.');
    }
  }
}
