import { Injectable } from '@nestjs/common';
import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import { PrismaService } from '../prisma.service';
import {
  CreateStaffRepositoryDto,
  ResponseCreateStaffRepositoryDto,
  StaffRoleType,
} from '@/domain/repositories/staff/dto/create-staff-repository.dto';
import { Prisma, StaffRole } from '@prisma/client';

@Injectable()
export class PrismaStaffRepository implements StaffRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateStaffRepositoryDto,
    tx?: Prisma.TransactionClient,
  ): Promise<ResponseCreateStaffRepositoryDto | null> {
    const client = tx ?? this.prismaService;
    const staff = await client.staff.create({
      data: {
        ...data,
        role: data.role as unknown as StaffRole,
      },
    });

    if (!staff) {
      return null;
    }

    return {
      id: staff.id,
      tenantId: staff.tenantId,
      fullName: staff.fullName,
      role: staff.role as unknown as StaffRoleType,
      email: staff.email ?? undefined,
      phone: staff?.phone ?? undefined,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }
}
