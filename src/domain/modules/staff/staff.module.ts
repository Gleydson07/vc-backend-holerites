import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import { PrismaStaffRepository } from '@/infra/database/prisma/repositories/prisma-staff.repository';
import { UsersModule } from '@/domain/modules/users/users.module';
import { CreateStaffUserUseCase } from './usecases/create-staff-user.usecase';
import { TransactionModule } from '@/domain/managers/transaction/transaction.module';

@Module({
  imports: [UsersModule, TransactionModule],
  controllers: [StaffController],
  providers: [
    CreateStaffUserUseCase,
    {
      provide: StaffRepository,
      useClass: PrismaStaffRepository,
    },
  ],
  exports: [StaffRepository],
})
export class StaffModule {}
