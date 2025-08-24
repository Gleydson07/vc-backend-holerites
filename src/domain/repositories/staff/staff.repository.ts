import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { StaffEntity } from '@/domain/entities/staff.entity';

@Injectable()
export abstract class StaffRepository {
  abstract create(
    data: StaffEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<StaffEntity | null>;
}
