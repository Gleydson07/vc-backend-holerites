import { Injectable } from '@nestjs/common';
import {
  CreateStaffRepositoryDto,
  ResponseCreateStaffRepositoryDto,
} from './dto/create-staff-repository.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export abstract class StaffRepository {
  abstract create(
    data: CreateStaffRepositoryDto,
    tx?: Prisma.TransactionClient,
  ): Promise<ResponseCreateStaffRepositoryDto | null>;
}
