import { Controller, Post, Body } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { TenantId } from '@/core/decorators/tenant-id.decorator';
import { CreateEmployeeUseCase } from './usecases/create-employee.usecase';

@Controller()
export class EmployeesController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @TenantId() tenantId: string,
  ) {
    return this.createEmployeeUseCase.execute(tenantId, createEmployeeDto);
  }
}
