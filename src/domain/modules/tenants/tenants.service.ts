import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UsersService } from '@/domain/modules/users/users.service';
import { UserRole } from '@/core/enums';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    const { admin, ...tenantData } = createTenantDto;

    const tenant = await this.prisma.tenant.create({
      data: { ...tenantData },
    });

    try {
      await this.usersService.create(tenant.id, {
        login: admin.login,
        name: admin.name,
        email: admin.email || '',
        phone: admin.phone || '',
        role: UserRole.ADMINISTRATORS,
      });
    } catch (error) {
      await this.prisma.tenant.delete({ where: { id: tenant.id } });
      throw error;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      socialName: tenant.socialName,
      cnpj: tenant.cnpj,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id },
      data: { ...updateTenantDto } as any,
    });
  }

  async remove(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deactivate(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
