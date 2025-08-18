import { AuthRepository } from '@/domain/repositories/auth/auth.repository';
import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import {
  GetTokenRepositoryDto,
  ResponseGetTokenRepositoryDto,
} from '@/domain/repositories/auth/dto/get-token-repository.dto';
import {
  NewPasswordChallengeRepositoryDto,
  ResponseNewPasswordChallengeRepositoryDto,
} from '@/domain/repositories/auth/dto/new-password-challenge-repository.dto';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
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

  async getToken(
    data: GetTokenRepositoryDto,
  ): Promise<ResponseGetTokenRepositoryDto> {
    const secretHash = this.calculateSecretHash(data.login);

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: data.login,
        PASSWORD: data.password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await this.cognitoClient.send(command);

    return {
      authenticationResult: {
        accessToken: response.AuthenticationResult?.AccessToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      },
      metadata: {
        httpStatusCode: response.$metadata.httpStatusCode!,
        requestId: response.$metadata.requestId!,
        extendedRequestId: response.$metadata.extendedRequestId,
        cfId: response.$metadata.cfId,
      },
      challengeParams: response.ChallengeParameters,
      challengeName: response.ChallengeName,
      session: response.Session,
    };
  }

  async newPasswordChallenge(
    data: NewPasswordChallengeRepositoryDto,
  ): Promise<ResponseNewPasswordChallengeRepositoryDto> {
    const secretHash = this.calculateSecretHash(data.login);

    const challengeResponses: Record<string, string> = {
      USERNAME: data.login,
      NEW_PASSWORD: data.newPassword,
      SECRET_HASH: secretHash,
    };

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      ChallengeResponses: challengeResponses,
      Session: data.session,
    });

    const response = await this.cognitoClient.send(command);

    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    };
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
