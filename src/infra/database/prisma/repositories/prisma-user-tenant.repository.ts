import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserTenantRepository } from '@/domain/repositories/user-tenant/user-tenant.repository';
import {
  CreateUserTenantRepositoryDto,
  ResponseCreateUserTenantRepositoryDto,
} from '@/domain/repositories/user-tenant/dto/create-user-tenant-repository.dto';
import { AccessProfile } from '@prisma/client';
import { UserRole } from '@/core/enums';

@Injectable()
export class PrismaUserTenantRepository implements UserTenantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateUserTenantRepositoryDto,
  ): Promise<ResponseCreateUserTenantRepositoryDto | null> {
    const userTenant = await this.prismaService.userTenant.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        accessProfile: data.userRole.toUpperCase() as unknown as AccessProfile,
      },
    });

    if (!userTenant) {
      return null;
    }

    return {
      tenantId: userTenant.tenantId,
      userId: userTenant.userId,
      userRole: userTenant.accessProfile as unknown as UserRole,
      createdAt: userTenant.createdAt,
      updatedAt: userTenant.updatedAt,
    };
  }
}
