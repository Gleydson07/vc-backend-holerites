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
  NotAuthorizedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'node:crypto';

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

  async signIn(cpf: string, senha: string) {
    const secretHash = this.calculateSecretHash(cpf);

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: cpf,
        PASSWORD: senha,
        SECRET_HASH: secretHash,
      },
    });

    try {
      const response = await this.cognitoClient.send(command);
      console.log('Cognito response:', response);

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
    const secretHash = this.calculateSecretHash(cpf);

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      ChallengeResponses: {
        USERNAME: cpf,
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
}
