import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(`Iniciando criação de tenant para: ${socialName}.`);

    try {
      this.logger.log(`Verificando se o tenant de CNPJ ${cnpj} já existe.`);
      const tenantAlreadyExists = await this.tenantRepository.findByCnpj(cnpj);

      if (tenantAlreadyExists) {
        this.logger.warn(
          `Tenant com CNPJ ${cnpj} já existe. Impossível criar!`,
        );
        throw new Error(`Tenant com CNPJ ${cnpj} já existe.`);
      }

      this.logger.log(`Tenant de CNPJ ${cnpj} não existe. Prosseguindo...`);

      let userProviderId: string | null = null;

      const provisionalPassword = (
        admin.name.at(0)?.toUpperCase() +
        admin.name.slice(1, 4).trim().toLowerCase() +
        admin.login.slice(0, 4) +
        'Ho#'
      )
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      try {
        this.logger.log(
          `Consultando existência do usuário admin ${admin.login} no provider.`,
        );
        userProviderId = await this.userRepository.getUserProviderId(
          admin.login,
        );
      } catch {
        this.logger.log(
          `Usuário admin ${admin.login} não encontrado no provider.`,
        );
      }

      if (!userProviderId) {
        this.logger.log(`Criando usuário admin ${admin.login} no provider.`);

        const userProvider = await this.userRepository.createUserProvider({
          username: admin.login,
          nickname: admin.name,
          email: admin.email,
          provisionalPassword: provisionalPassword,
        });

        if (!userProvider.userProviderId) {
          this.logger.error('Erro ao obter ID do usuário admin do provider.');
          throw new Error('Erro ao obter ID do usuário admin do provider.');
        }

        this.logger.log(
          `Usuário admin ${admin.login} criado no provider com sucesso.`,
        );
        userProviderId = userProvider.userProviderId;
      }

      this.logger.log(
        `Verificando se o usuário admin já existe no banco de dados.`,
      );
      let user = await this.userRepository.findByUserProviderId(userProviderId);

      this.logger.log(
        `Usuário admin ${user?.id ? 'encontrado' : 'não encontrado'} no banco de dados.`,
      );
      if (!user) {
        this.logger.log(
          `Criando usuário admin ${admin.login} no banco de dados.`,
        );
        user = await this.userRepository.create({
          username: admin.login,
          nickname: admin.name,
          email: admin.email,
          userProviderId: userProviderId,
        });

        if (!user?.id) {
          this.logger.error('Falha no processo de criação do tenant.');
          throw new Error('Falha no processo de criação do tenant.');
        }

        this.logger.log(
          `Usuário admin ${admin.login} criado no banco de dados.`,
        );
      }

      this.logger.log('Criando tenant.');
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
      this.logger.log(`Tenant ${tenant.name} criado com sucesso.`);

      this.logger.log('Criando associação entre usuário admin e tenant.');
      const userTenant = await this.userTenantRepository.create({
        tenantId: tenant.id,
        userId: user.id,
        userRole: UserRole.ADMINISTRATORS,
      });

      if (!userTenant) {
        this.logger.error(
          'Erro ao criar associação entre usuário admin e tenant.',
        );
        throw new Error(
          'Erro ao criar associação entre usuário admin e tenant.',
        );
      }

      this.logger.log('Tenant e usuário admin associados com sucesso.');

      this.logger.log(`Retornando dados do tenant.`);
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
      throw new BadRequestException('Erro ao criar tenant.');
    }
  }
}
