// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AdminCreateUserCommand,
  NotAuthorizedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
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

  async signIn(cpf: string, senha: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_SRP_AUTH',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: cpf,
        PASSWORD: senha,
      },
    });

    try {
      const response = await this.cognitoClient.send(command);

      if (response.AuthenticationResult) {
        return {
          success: true,
          tokens: response.AuthenticationResult,
        };
      }

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return {
          success: false,
          challengeName: 'NEW_PASSWORD_REQUIRED',
          session: response.Session,
        };
      }

      throw new UnauthorizedException('Processo de autenticação inesperado.');
    } catch (error) {
      if (
        error instanceof NotAuthorizedException ||
        error instanceof UserNotFoundException
      ) {
        throw new UnauthorizedException('CPF ou senha inválidos.');
      }
      throw error;
    }
  }

  async respondToNewPasswordChallenge(
    cpf: string,
    novaSenha: string,
    session: string,
  ) {
    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      ChallengeResponses: {
        USERNAME: cpf,
        NEW_PASSWORD: novaSenha,
      },
      Session: session,
    });

    try {
      const response = await this.cognitoClient.send(command);

      return {
        success: true,
        tokens: response.AuthenticationResult,
      };
    } catch (error) {
      throw new BadRequestException(
        'Não foi possível definir a nova senha. ' + error.message,
      );
    }
  }

  async adminCreateUser(cpf: string, email: string | null, nome: string) {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: cpf,
      TemporaryPassword: Math.random().toString(36).slice(-8) + 'A1!',
      UserAttributes: [
        {
          Name: 'name',
          Value: nome,
        },
        ...(email
          ? [
              { Name: 'email', Value: email },
              { Name: 'email_verified', Value: 'true' },
            ]
          : []),
      ],
      MessageAction: 'SUPPRESS', // Não envia o e-mail de boas-vindas padrão do Cognito
    });

    try {
      const response = await this.cognitoClient.send(command);
      console.log('Senha temporária gerada:', command.input.TemporaryPassword);
      return response.User;
    } catch (error) {
      throw new BadRequestException('Erro ao criar usuário: ' + error.message);
    }
  }
}
