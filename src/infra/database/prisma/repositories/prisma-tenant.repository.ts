import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TenantRepository } from '@/domain/repositories/tenant/tenant.repository';
import {
  CreateTenantRepositoryDto,
  ResponseCreateTenantRepositoryDto,
} from '@/domain/repositories/tenant/dto/create-tenant-repository.dto';

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateTenantRepositoryDto,
  ): Promise<ResponseCreateTenantRepositoryDto | null> {
    const tenant = await this.prismaService.tenant.create({
      data: {
        name: data.name,
        socialName: data.socialName,
        cnpj: data.cnpj,
      },
    });

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      socialName: tenant.socialName,
      cnpj: tenant.cnpj,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}
