import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from '@/domain/entities/employee.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export abstract class EmployeeRepository {
  abstract create(
    data: EmployeeEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<EmployeeEntity | null>;
}
