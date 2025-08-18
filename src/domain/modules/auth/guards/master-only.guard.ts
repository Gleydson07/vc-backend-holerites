import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { IS_MASTER_ONLY_KEY } from '../decorators/master-only.decorator';

@Injectable()
export class MasterOnlyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isMasterOnly = this.reflector.getAllAndOverride<boolean>(
      IS_MASTER_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isMasterOnly) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new ForbiddenException('Missing token');

    const decoded: any = jwt.decode(token, { complete: true });
    const sub = decoded?.payload?.sub as string | undefined;

    const masterSub = process.env.MASTER_USER_PROVIDER_ID;
    if (!masterSub) {
      throw new ForbiddenException('MASTER_USER_PROVIDER_ID not configured');
    }

    if (sub !== masterSub) {
      throw new ForbiddenException('Only master user can access this resource');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [, token] = authHeader.split(' ');
    return token || null;
  }
}
