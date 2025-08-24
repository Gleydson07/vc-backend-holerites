import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { UsersModule } from '@/domain/modules/users/users.module';
import { TenantRepository } from '@/domain/repositories/tenant/tenant.repository';
import { PrismaTenantRepository } from '@/infra/database/prisma/repositories/prisma-tenant.repository';

@Module({
  imports: [UsersModule],
  controllers: [TenantsController],
  providers: [
    {
      provide: TenantRepository,
      useClass: PrismaTenantRepository,
    },
  ],
})
export class TenantsModule {}
