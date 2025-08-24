import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const raw =
      request.headers['x-tenant-id'] ||
      request.headers['X-Tenant-Id'] ||
      request.headers['x-Tenant-Id'];

    const tenantId = Array.isArray(raw) ? raw[0] : raw;

    if (!tenantId || typeof tenantId !== 'string' || tenantId.trim() === '') {
      throw new BadRequestException('Header x-tenant-id é obrigatório');
    }

    return tenantId.trim();
  },
);
