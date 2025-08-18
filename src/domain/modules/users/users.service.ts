import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AccessProfile } from '@prisma/client';
import { UserRole } from '@/core/enums';

@Injectable()
export class UsersService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const region = this.configService.get<string>('COGNITO_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS Cognito configuration values');
    }

    this.cognitoClient = new CognitoIdentityProviderClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async create(
    tenantId: string,
    { login, name, role, email, phone }: CreateUserDto,
  ) {
    const roleLowercase = role.toLowerCase() as UserRole;
    const givenName =
      `${name.split(' ')[0]} ${name.split(' ')[1] || ''}`.trim();

    const provisionalPassword = (
      givenName.at(0)?.toUpperCase() +
      givenName.slice(1, 4).trim().toLowerCase() +
      login.slice(0, 4) +
      'Px#'
    )
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
      TemporaryPassword: provisionalPassword,
      UserAttributes: [{ Name: 'email', Value: email || '' }],
      MessageAction: 'SUPPRESS',
    });

    const tempPassword = createUserCommand.input.TemporaryPassword;

    try {
      const createUserResponse: AdminCreateUserCommandOutput =
        await this.cognitoClient.send(createUserCommand);

      const sub = createUserResponse.User?.Attributes?.find(
        (attr) => attr.Name === 'sub',
      )?.Value;

      if (!sub) {
        throw new BadRequestException(
          'Usuário criado no Cognito, mas sub não retornado.',
        );
      }

      const user = await this.prisma.user.create({
        data: {
          userProviderId: sub,
          username: login,
          nickname: name,
        },
      });

      await this.prisma.userTenant.create({
        data: {
          userId: user.id,
          tenantId: tenantId,
          accessProfile: AccessProfile.EMPLOYEE,
        },
      });

      if (roleLowercase === UserRole.EMPLOYEES) {
        await this.prisma.employee.create({
          data: {
            tenantId: tenantId,
            userId: user.id,
            cpf: login,
            fullName: name,
            email: email || null,
            phone: phone || null,
          },
        });
      }

      return {
        login: createUserResponse.User?.Username,
        senhaTemporaria: tempPassword,
        nome: name,
        role: role,
        message: `Será solicitado que o usuário ${givenName} altere a senha temporária na primeira vez que fizer login.`,
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(
          `Usuário com login ${login} não encontrado.`,
        );
      }

      if (
        error.name === 'ResourceNotFoundException' ||
        error.name === 'InvalidParameterException'
      ) {
        try {
          const deleteUserCommand = new AdminDeleteUserCommand({
            UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
            Username: login,
          });

          await this.cognitoClient.send(deleteUserCommand);
        } catch (deleteError) {
          console.error(
            'Erro ao deletar usuário após falha na adição a role:',
            deleteError,
          );
        }
      }

      throw new BadRequestException(
        'Erro ao criar usuário ou atribuir roles: ' + error.message,
      );
    }
  }

  async updateUserAttributes(
    login: string,
    attributes: { Name: string; Value: string }[],
  ) {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
      UserAttributes: attributes,
    });

    try {
      await this.cognitoClient.send(command);
      return { message: `Dados do usuário ${login} atualizados com sucesso.` };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao atualizar dados: ${error.message}`,
      );
    }
  }

  async disableUser(login: string) {
    const command = new AdminDisableUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A conta do usuário com login ${login} foi desabilitada com sucesso.`,
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(
          `Usuário com login ${login} não encontrado.`,
        );
      }
      throw new BadRequestException(
        `Erro ao desabilitar usuário: ${error.message}`,
      );
    }
  }

  async enableUser(login: string) {
    const command = new AdminEnableUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A conta do usuário com login ${login} foi reativada com sucesso.`,
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(
          `Usuário com login ${login} não encontrado.`,
        );
      }
      throw new BadRequestException(
        `Erro ao reativar usuário: ${error.message}`,
      );
    }
  }

  async toggleUserStatus(login: string, enabled: boolean) {
    if (enabled) {
      return this.enableUser(login);
    } else {
      return this.disableUser(login);
    }
  }

  async changeUserGroup(login: string, newGroup: string, oldGroup: string) {
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
      GroupName: newGroup,
    });

    const removeFromGroupCommand = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
      GroupName: oldGroup,
    });

    try {
      await this.cognitoClient.send(addToGroupCommand);
      await this.cognitoClient.send(removeFromGroupCommand);

      return {
        message: `Usuário ${login} movido do grupo ${oldGroup} para ${newGroup}.`,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao alterar grupo: ${error.message}`);
    }
  }

  async addUserToGroups(login: string, grupos: string[]) {
    const addToGroupPromises = grupos.map((grupo) => {
      const addUserToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
        Username: login,
        GroupName: grupo,
      });
      return this.cognitoClient.send(addUserToGroupCommand);
    });

    try {
      await Promise.all(addToGroupPromises);
      return {
        message: `Usuário ${login} adicionado aos grupos: ${grupos.join(', ')}.`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao adicionar grupos: ${error.message}`,
      );
    }
  }

  async removeUserFromGroups(login: string, grupos: string[]) {
    const removeFromGroupPromises = grupos.map((grupo) => {
      const removeUserFromGroupCommand = new AdminRemoveUserFromGroupCommand({
        UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
        Username: login,
        GroupName: grupo,
      });
      return this.cognitoClient.send(removeUserFromGroupCommand);
    });

    try {
      await Promise.all(removeFromGroupPromises);
      return {
        message: `Usuário ${login} removido dos grupos: ${grupos.join(', ')}.`,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao remover grupos: ${error.message}`);
    }
  }

  async setUserGroups(login: string, novosGrupos: string[]) {
    try {
      const gruposAtuais = await this.getUserGroups(login);

      if (gruposAtuais.length > 0) {
        await this.removeUserFromGroups(login, gruposAtuais);
      }

      await this.addUserToGroups(login, novosGrupos);

      return {
        message: `Grupos do usuário ${login} atualizados para: ${novosGrupos.join(', ')}.`,
        gruposAnteriores: gruposAtuais,
        gruposAtuais: novosGrupos,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao atualizar grupos: ${error.message}`,
      );
    }
  }

  async removeUserFromGroup(login: string, groupName: string) {
    const command = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
      GroupName: groupName,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A role '${groupName}' foi removida do usuário ${login}.`,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao remover role: ${error.message}`);
    }
  }

  async getUserGroups(login: string): Promise<string[]> {
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: login,
    });

    try {
      const response = await this.cognitoClient.send(command);

      if (response.Groups && response.Groups.length > 0) {
        return response.Groups.map((group) => group.GroupName || '').filter(
          (name) => name !== '',
        );
      }

      return [];
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(
          `Usuário com login ${login} não encontrado.`,
        );
      }
      throw new BadRequestException(
        `Erro ao buscar grupos do usuário: ${error.message}`,
      );
    }
  }

  async listUsersByGroup(
    groupName: string,
    params: {
      nome?: string;
      login?: string;
      ativo?: boolean;
      cursor?: string;
      limit: number;
    },
  ) {
    const { cursor, limit } = params;

    const command = new ListUsersInGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      GroupName: groupName,
      Limit: Math.min(60, limit), // Cognito max é 60
      NextToken: cursor,
    });

    const response = await this.cognitoClient.send(command);
    const users = response.Users || [];

    const usersWithGroups = users.map((user) => ({
      login: user.Username,
      nome: user.Attributes?.find((attr) => attr.Name === 'name')?.Value,
      email: user.Attributes?.find((attr) => attr.Name === 'email')?.Value,
      ativo: user.Enabled,
      status:
        user.UserStatus === 'FORCE_CHANGE_PASSWORD'
          ? 'Mudança de senha pendente'
          : user.UserStatus,
      createdAt: user.UserCreateDate,
      lastModified: user.UserLastModifiedDate,
    }));

    return {
      users: usersWithGroups,
      pagination: {
        nextCursor: response.NextToken,
        hasMore: !!response.NextToken,
        itemsPerPage: limit,
      },
    };
  }
}
