import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeeRepository } from '@/domain/repositories/employee/employee.repository';
import { PrismaEmployeeRepository } from '@/infra/database/prisma/repositories/prisma-employee.repository';
import { UsersModule } from '../users/users.module';
import { TransactionModule } from '@/domain/managers/transaction/transaction.module';
import { CreateEmployeeUseCase } from './usecases/create-employee.usecase';

@Module({
  imports: [UsersModule, TransactionModule],
  controllers: [EmployeesController],
  providers: [
    CreateEmployeeUseCase,
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
  ],
  exports: [EmployeeRepository],
})
export class EmployeesModule {}
