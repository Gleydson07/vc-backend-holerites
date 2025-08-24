import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '@/domain/modules/auth/auth.module';
import { UsersModule } from '@/domain/modules/users/users.module';
import { TenantsModule } from '@/domain/modules/tenants/tenants.module';
import { DatabaseModule } from './infra/database/database.module';
import { EmployeesModule } from './domain/modules/employees/employees.module';
import { StaffModule } from './domain/modules/staff/staff.module';
import { TransactionModule } from './domain/managers/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TransactionModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    StaffModule,
    TenantsModule,
    RouterModule.register([
      { path: 'auth', module: AuthModule },
      { path: 'tenants', module: TenantsModule },
      { path: 'staff', module: StaffModule },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
