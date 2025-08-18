import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantRepository } from '@/domain/repositories/tenant/tenant.repository';
import { UserTenantRepository } from '@/domain/repositories/user-tenant/user-tenant.repository';
import { UserRole } from '@/core/enums';

@Injectable()
export class CreateTenantWithUserAdminUseCase {
  private readonly logger = new Logger(CreateTenantWithUserAdminUseCase.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userTenantRepository: UserTenantRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateTenantDto) {
    const { name, socialName, cnpj, admin } = data;
    this.logger.log(`Iniciando criação de tenant para: ${socialName}`);

    try {
      const tenant = await this.tenantRepository.create({
        name,
        socialName,
        cnpj,
      });

      if (!tenant) {
        this.logger.error('Erro ao criar tenant', {
          tenantData: { name, socialName, cnpj },
        });
        throw new Error('Erro ao criar tenant.');
      }

      const provisionalPassword = (
        admin.name.at(0)?.toUpperCase() +
        admin.name.slice(1, 4).trim().toLowerCase() +
        admin.login.slice(0, 4) +
        'Ho#'
      )
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const userProvider = await this.userRepository.createUserProvider({
        username: admin.login,
        nickname: admin.name,
        email: admin.email,
        provisionalPassword: provisionalPassword,
      });

      const user = await this.userRepository.create({
        username: admin.login,
        nickname: admin.name,
        email: admin.email,
        userProviderId: userProvider.userProviderId,
      });

      if (!user) {
        this.logger.error('Erro ao criar usuário admin.');
        throw new Error('Erro ao criar usuário admin.');
      }

      const userTenant = await this.userTenantRepository.create({
        tenantId: tenant.id,
        userId: user.id,
        userRole: UserRole.ADMINISTRATORS,
      });

      if (!userTenant) {
        this.logger.error('Erro ao criar associação entre usuário e tenant.');
        throw new Error('Erro ao criar associação entre usuário e tenant.');
      }

      this.logger.log('Tenant e usuário admin criados com sucesso.');
      return {
        id: tenant.id,
        name: tenant.name,
        socialName: tenant.socialName,
        cnpj: tenant.cnpj,
        admin: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          provisionalPassword: provisionalPassword,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      this.logger.error('Erro ao criar tenant', error);
      throw new UnauthorizedException('Erro ao criar tenant.');
    }
  }
}
