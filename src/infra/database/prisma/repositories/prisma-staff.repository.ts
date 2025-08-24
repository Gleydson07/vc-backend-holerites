import { Injectable } from '@nestjs/common';
import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { StaffEntity } from '@/domain/entities/staff.entity';
import { PrismaStaffMapper } from '../mappers/prisma-staff.mapper';

@Injectable()
export class PrismaStaffRepository implements StaffRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: StaffEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<StaffEntity | null> {
    const client = tx ?? this.prismaService;

    const staff = await client.staff.create({
      data: PrismaStaffMapper.toPrisma(data),
    });

    if (!staff) {
      return null;
    }

    return PrismaStaffMapper.toDomain(staff);
  }
}
