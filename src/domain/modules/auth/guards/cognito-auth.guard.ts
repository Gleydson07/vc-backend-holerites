import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri: process.env.COGNITO_JWKS_URI || '',
  });
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const decoded: any = jwt.decode(token, { complete: true });

      if (!decoded || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token');
      }

      const key = await this.getSigningKey(decoded.header.kid);
      jwt.verify(token, key, { algorithms: ['RS256'] });

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token', err.message);
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];

    if (!authHeader) return null;
    const [, token] = authHeader.split(' ');
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
