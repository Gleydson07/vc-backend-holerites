import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserGroups } from '../../../../core/enums';
import { UsersService } from '../users.service';

@Injectable()
export class UserManagementGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.grupos;

    // Transforma grupos para lowercase se existirem no body
    if (request.body && Array.isArray(request.body.grupos)) {
      request.body.grupos = request.body.grupos.map((grupo: string) =>
        typeof grupo === 'string' ? grupo.toLowerCase() : grupo,
      );
    }

    // Para criação de usuário, verifica o grupo do body
    const targetGroups = request.body?.grupos;
    if (targetGroups && targetGroups.length > 0) {
      return this.checkCreationPermissions(userRole, targetGroups);
    }

    // Para outras operações (enable/disable), verifica o grupo do usuário alvo
    const targetLogin = request.body?.login || request.params?.login;
    if (targetLogin) {
      try {
        const targetUserGroups =
          await this.usersService.getUserGroups(targetLogin);
        return this.checkManagementPermissions(userRole, targetUserGroups);
      } catch (error) {
        // Se não conseguir obter o grupo do usuário, nega o acesso
        throw new ForbiddenException('Não foi possível verificar permissões');
      }
    }

    throw new ForbiddenException('Informações insuficientes para validação');
  }

  private checkCreationPermissions(
    userRoles: string[],
    targetGroups: string[],
  ): boolean {
    if (
      !userRoles ||
      userRoles.length === 0 ||
      !targetGroups ||
      targetGroups.length === 0
    ) {
      throw new ForbiddenException('Informações de usuário insuficientes');
    }

    // ADMINISTRATORS podem criar qualquer tipo de usuário
    if (userRoles.some((role) => role === UserGroups.ADMINISTRATORS)) {
      return true;
    }

    // MANAGERS podem criar apenas EMPLOYEES
    if (
      userRoles.some((role) => role === UserGroups.MANAGERS) &&
      targetGroups.includes(UserGroups.EMPLOYEES)
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para criar este tipo de usuário',
    );
  }

  private checkManagementPermissions(
    userRole: string,
    targetUserGroups: string[],
  ): boolean {
    if (!userRole || !targetUserGroups || targetUserGroups.length === 0) {
      throw new ForbiddenException('Informações de usuário insuficientes');
    }

    // ADMINISTRATORS podem gerenciar qualquer tipo de usuário
    if (userRole === UserGroups.ADMINISTRATORS) {
      return true;
    }

    // MANAGERS podem gerenciar apenas EMPLOYEES
    if (
      userRole === UserGroups.MANAGERS &&
      targetUserGroups.includes(UserGroups.EMPLOYEES)
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para gerenciar este tipo de usuário',
    );
  }
}
