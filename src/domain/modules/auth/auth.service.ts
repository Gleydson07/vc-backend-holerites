import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  RespondToAuthChallengeCommand,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { SessionResponseDto } from './dto/session-response.dto';

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

  async signIn(login: string, senha: string) {
    const secretHash = this.calculateSecretHash(login);

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: login,
        PASSWORD: senha,
        SECRET_HASH: secretHash,
      },
    });

    try {
      const response = await this.cognitoClient.send(command);

      if (response.AuthenticationResult) {
        let user: SessionResponseDto | null = null;

        if (response.AuthenticationResult.AccessToken) {
          user = await this.getSession(
            response.AuthenticationResult.AccessToken,
          );
        }

        return {
          success: true,
          accessToken: response.AuthenticationResult.AccessToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          user: {
            id: user?.id || '',
            nomeCompleto: user?.nomeCompleto || '',
            primeiroNome: user?.primeiroNome || '',
          },
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
        throw new UnauthorizedException('Login(CPF) ou senha inválidos.');
      }
      throw error;
    }
  }

  async respondToNewPasswordChallenge(
    login: string,
    novaSenha: string,
    session: string,
  ) {
    const secretHash = this.calculateSecretHash(login);

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      ChallengeResponses: {
        USERNAME: login,
        NEW_PASSWORD: novaSenha,
        SECRET_HASH: secretHash,
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

  async getSession(accessToken: string): Promise<SessionResponseDto> {
    try {
      const getUserCommand = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await this.cognitoClient.send(getUserCommand);

      const nomeCompleto =
        response.UserAttributes?.find((attr) => attr.Name === 'name')?.Value ||
        '';

      const primeiroNome = nomeCompleto.split(' ')[0] || '';

      const login = response.Username;
      if (!login) {
        throw new BadRequestException(
          'Não foi possível obter o login(CPF) do usuário',
        );
      }

      const grupos = await this.getUserGroups(login);

      const sub =
        response.UserAttributes?.find((attr) => attr.Name === 'sub')?.Value ||
        '';

      return {
        id: sub,
        nomeCompleto,
        primeiroNome,
        grupos,
      };
    } catch (error) {
      if (
        error.name === 'NotAuthorizedException' ||
        error.name === 'UserNotFoundException'
      ) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }
      throw error;
    }
  }

  private async getUserGroups(login: string): Promise<string[]> {
    try {
      const listGroupsCommand = new AdminListGroupsForUserCommand({
        UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
        Username: login,
      });

      const response = await this.cognitoClient.send(listGroupsCommand);

      return (
        response.Groups?.map((group) => group.GroupName).filter(
          (name): name is string => !!name,
        ) || []
      );
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  private calculateSecretHash(username: string): string {
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'COGNITO_CLIENT_SECRET',
    );

    if (!clientSecret) {
      throw new Error('Missing Cognito client secret');
    }

    const hmac = createHmac('sha256', clientSecret);
    hmac.update(username + clientId);
    return hmac.digest('base64');
  }
}
