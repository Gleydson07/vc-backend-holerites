import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { UsersModule } from '@/domain/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TenantsController],
  providers: [],
})
export class TenantsModule {}
