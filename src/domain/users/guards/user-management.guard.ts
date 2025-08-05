import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserGroups } from '../../../core';
import { UsersService } from '../users.service';

@Injectable()
export class UserManagementGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.grupo;

    // Para criação de usuário, verifica o grupo do body
    const targetGroup = request.body?.grupo;
    if (targetGroup) {
      return this.checkCreationPermissions(userRole, targetGroup);
    }

    // Para outras operações (enable/disable), verifica o grupo do usuário alvo
    const targetCpf = request.body?.cpf || request.params?.cpf;
    if (targetCpf) {
      try {
        const targetUserGroup = await this.usersService.getUserGroup(targetCpf);
        return this.checkManagementPermissions(userRole, targetUserGroup);
      } catch (error) {
        // Se não conseguir obter o grupo do usuário, nega o acesso
        throw new ForbiddenException('Não foi possível verificar permissões');
      }
    }

    throw new ForbiddenException('Informações insuficientes para validação');
  }

  private checkCreationPermissions(
    userRole: string,
    targetGroup: string,
  ): boolean {
    if (!userRole || !targetGroup) {
      throw new ForbiddenException('Informações de usuário insuficientes');
    }

    // ADMINISTRATORS podem criar qualquer tipo de usuário
    if (userRole === UserGroups.ADMINISTRATORS) {
      return true;
    }

    // MANAGERS podem criar apenas EMPLOYEES
    if (
      userRole === UserGroups.MANAGERS &&
      targetGroup === UserGroups.EMPLOYEES
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para criar este tipo de usuário',
    );
  }

  private checkManagementPermissions(
    userRole: string,
    targetUserGroup: string,
  ): boolean {
    if (!userRole || !targetUserGroup) {
      throw new ForbiddenException('Informações de usuário insuficientes');
    }

    // ADMINISTRATORS podem gerenciar qualquer tipo de usuário
    if (userRole === UserGroups.ADMINISTRATORS) {
      return true;
    }

    // MANAGERS podem gerenciar apenas EMPLOYEES
    if (
      userRole === UserGroups.MANAGERS &&
      targetUserGroup === UserGroups.EMPLOYEES
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para gerenciar este tipo de usuário',
    );
  }
}
