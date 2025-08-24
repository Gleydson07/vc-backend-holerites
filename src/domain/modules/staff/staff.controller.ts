import { Controller, Post, Body } from '@nestjs/common';
import { CreateStaffUserUseCase } from './usecases/create-staff-user.usecase';
import { CreateStaffDto } from './dto/create-staff.dto';
import { TenantId } from '@/core/decorators/tenant-id.decorator';

@Controller()
export class StaffController {
  constructor(
    private readonly createStaffUserUseCase: CreateStaffUserUseCase,
  ) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto, @TenantId() tenantId: string) {
    return this.createStaffUserUseCase.execute(tenantId, createStaffDto);
  }
}
