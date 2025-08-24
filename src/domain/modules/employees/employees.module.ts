import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';

@Module({
  controllers: [EmployeesController],
  providers: [],
})
export class EmployeesModule {}
