import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from '@/domain/modules/auth/auth.module';
import { UsersModule } from '@/domain/modules/users/users.module';
import { TenantsModule } from '@/domain/modules/tenants/tenants.module';
import { DatabaseModule } from './infra/database/database.module';
import { TenantGuard } from './domain/modules/auth/guards/tenant.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      { path: 'users', module: UsersModule },
      { path: 'tenants', module: TenantsModule },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
