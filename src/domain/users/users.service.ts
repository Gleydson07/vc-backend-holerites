import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminUpdateUserAttributesCommand,
  AdminRemoveUserFromGroupCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminListGroupsForUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private configService: ConfigService) {
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

  async create({ cpf, email, nome, grupo }: CreateUserDto) {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      TemporaryPassword: Math.random().toString(36).slice(-6) + 'A1!',
      UserAttributes: [
        { Name: 'name', Value: nome },
        ...(email
          ? [
              { Name: 'email', Value: email },
              { Name: 'email_verified', Value: 'true' },
            ]
          : []),
      ],
      MessageAction: 'SUPPRESS',
    });

    const tempPassword = createUserCommand.input.TemporaryPassword;
    console.log('Senha temporária:', tempPassword);

    try {
      const createUserResponse =
        await this.cognitoClient.send(createUserCommand);

      const addUserToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
        Username: cpf,
        GroupName: grupo,
      });

      await this.cognitoClient.send(addUserToGroupCommand);

      return createUserResponse.User;
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(`Usuário com CPF ${cpf} não encontrado.`);
      }

      if (
        error.name === 'ResourceNotFoundException' ||
        error.name === 'InvalidParameterException'
      ) {
        const deleteUserCommand = new AdminDeleteUserCommand({
          UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
          Username: cpf,
        });

        try {
          await this.cognitoClient.send(deleteUserCommand);
        } catch (deleteError) {
          console.error(
            'Erro ao deletar usuário após falha na adição ao grupo:',
            deleteError,
          );
        }
      }

      throw new BadRequestException(
        'Erro ao criar usuário ou atribuir grupo: ' + error.message,
      );
    }
  }

  async updateUserAttributes(
    cpf: string,
    attributes: { Name: string; Value: string }[],
  ) {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      UserAttributes: attributes,
    });

    try {
      await this.cognitoClient.send(command);
      return { message: `Dados do usuário ${cpf} atualizados com sucesso.` };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao atualizar dados: ${error.message}`,
      );
    }
  }

  async disableUser(cpf: string) {
    const command = new AdminDisableUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A conta do usuário com CPF ${cpf} foi desabilitada com sucesso.`,
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(`Usuário com CPF ${cpf} não encontrado.`);
      }
      throw new BadRequestException(
        `Erro ao desabilitar usuário: ${error.message}`,
      );
    }
  }

  async enableUser(cpf: string) {
    const command = new AdminEnableUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A conta do usuário com CPF ${cpf} foi reativada com sucesso.`,
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(`Usuário com CPF ${cpf} não encontrado.`);
      }
      throw new BadRequestException(
        `Erro ao reativar usuário: ${error.message}`,
      );
    }
  }

  async toggleUserStatus(cpf: string, enabled: boolean) {
    if (enabled) {
      return this.enableUser(cpf);
    } else {
      return this.disableUser(cpf);
    }
  }

  async changeUserGroup(cpf: string, newGroup: string, oldGroup: string) {
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      GroupName: newGroup,
    });

    const removeFromGroupCommand = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      GroupName: oldGroup,
    });

    try {
      await this.cognitoClient.send(addToGroupCommand);
      await this.cognitoClient.send(removeFromGroupCommand);

      return {
        message: `Usuário ${cpf} movido do grupo ${oldGroup} para ${newGroup}.`,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao alterar grupo: ${error.message}`);
    }
  }

  async removeUserFromGroup(cpf: string, groupName: string) {
    const command = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      GroupName: groupName,
    });

    try {
      await this.cognitoClient.send(command);
      return {
        message: `A role '${groupName}' foi removida do usuário ${cpf}.`,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao remover role: ${error.message}`);
    }
  }

  async getUserGroup(cpf: string): Promise<string> {
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
    });

    try {
      const response = await this.cognitoClient.send(command);

      // Retorna o primeiro grupo encontrado (assumindo que o usuário tem apenas um grupo)
      if (response.Groups && response.Groups.length > 0) {
        return response.Groups[0].GroupName || '';
      }

      throw new NotFoundException('Usuário não pertence a nenhum grupo');
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException(`Usuário com CPF ${cpf} não encontrado.`);
      }
      throw new BadRequestException(
        `Erro ao buscar grupos do usuário: ${error.message}`,
      );
    }
  }
}
