import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const IS_TENANT_OPTIONAL_KEY = 'tenant_optional_key_01';
    const skipTenant = this.reflector.getAllAndOverride<boolean>(
      IS_TENANT_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipTenant) return true;

    const tenantId =
      request.headers['tenant-id'] || request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('Tenant not found');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId.toString() },
    });

    if (!tenant) throw new ForbiddenException('Tenant not found');

    (request as any).tenantId = tenantId.toString();

    return true;
  }
}
