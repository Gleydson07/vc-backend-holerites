import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { UsersModule } from '@/domain/modules/users/users.module';
import { TenantRepository } from '@/domain/repositories/tenant/tenant.repository';
import { PrismaTenantRepository } from '@/infra/database/prisma/repositories/prisma-tenant.repository';
import { UserTenantRepository } from '@/domain/repositories/user-tenant/user-tenant.repository';
import { PrismaUserTenantRepository } from '@/infra/database/prisma/repositories/prisma-user-tenant.repository';
import { CreateTenantWithUserAdminUseCase } from './usecases/create-tenant-with-user-admin.usecase';

@Module({
  imports: [UsersModule],
  controllers: [TenantsController],
  providers: [
    CreateTenantWithUserAdminUseCase,
    {
      provide: TenantRepository,
      useClass: PrismaTenantRepository,
    },
    {
      provide: UserTenantRepository,
      useClass: PrismaUserTenantRepository,
    },
  ],
})
export class TenantsModule {}
