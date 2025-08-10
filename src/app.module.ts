import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from '@/domain/modules/auth/auth.module';
import { UsersModule } from '@/domain/modules/users/users.module';
import { TenantsModule } from '@/domain/modules/tenants/tenants.module';
import { PayslipsModule } from '@/domain/modules/payslips/payslips.module';
import { JwtAuthGuard } from '@/domain/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TenantsModule,
    PayslipsModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      { path: 'users', module: UsersModule },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
