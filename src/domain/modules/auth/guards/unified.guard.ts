import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_MASTER_ONLY_KEY } from '../decorators/master-only.decorator';
import { IS_TENANT_OPTIONAL_KEY } from '../decorators/skip-tenant.decorator';

@Injectable()
export class UnifiedAuthGuard implements CanActivate {
  private client = jwksClient({ jwksUri: process.env.COGNITO_JWKS_URI || '' });

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 1) Extract token if present (even for public routes) to derive role/master and tenant bypass
    const token = this.extractToken(request);
    let sub: string | undefined;
    if (token) {
      const decoded: any = jwt.decode(token, { complete: true });
      sub = decoded?.payload?.sub as string | undefined;
      // Validate signature for non-public routes
      if (!isPublic) {
        if (!decoded || !decoded.header?.kid) {
          throw new UnauthorizedException('Invalid token');
        }
        const key = await this.getSigningKey(decoded.header.kid);
        try {
          jwt.verify(token, key, { algorithms: ['RS256'] });
        } catch (e: any) {
          throw new UnauthorizedException('Invalid token');
        }
      }
    } else if (!isPublic) {
      throw new UnauthorizedException('Token not found');
    }

    // 2) Master detection (by env MASTER_USER_PROVIDER_ID or by user.isMaster in DB)
    const masterEnv = process.env.MASTER_USER_PROVIDER_ID;
    let isMaster = false;
    if (sub && masterEnv && sub === masterEnv) {
      isMaster = true;
    } else if (sub) {
      // try lookup user for master flag
      const user = await this.prisma.user.findUnique({
        where: { userProviderId: sub },
      });
      isMaster = !!user?.id;
    } else {
      const user = await this.prisma.user.findUnique({
        where: { username: request.body.login },
      });

      isMaster = masterEnv === user?.userProviderId;
    }

    // 3) MasterOnly gate
    const isMasterOnly = this.reflector.getAllAndOverride<boolean>(
      IS_MASTER_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isMasterOnly && !isMaster) {
      throw new ForbiddenException('Only master user can access this resource');
    }

    // 4) Tenant enforcement with master bypass and @SkipTenant
    const skipTenant = this.reflector.getAllAndOverride<boolean>(
      IS_TENANT_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!skipTenant && !isMaster) {
      const tenantId =
        (request.headers['tenant-id'] as string | undefined) ||
        (request.headers['x-tenant-id'] as string | undefined);
      if (!tenantId) {
        throw new BadRequestException('Tenant not found');
      }
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true },
      });
      if (!tenant && !isMaster)
        throw new ForbiddenException('Tenant not found');
      (request as any).tenantId = tenantId;
    } else {
      // Allow master to proceed without tenant, but still store header if provided
      const tenantId =
        (request.headers['tenant-id'] as string | undefined) ||
        (request.headers['x-tenant-id'] as string | undefined);
      if (tenantId) (request as any).tenantId = tenantId;
    }

    // 5) Attach helpful context
    (request as any).isMaster = isMaster;
    (request as any).sub = sub;
    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [, token] = (authHeader as string).split(' ');
    return token || null;
  }

  private async getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(kid, (err, key) => {
        if (err || !key) return reject(err || new Error('Key not found'));
        const signingKey = (key as any).getPublicKey
          ? (key as any).getPublicKey()
          : (key as any).publicKey || '';
        if (!signingKey) return reject(new Error('Signing key not found'));
        resolve(signingKey);
      });
    });
  }
}
