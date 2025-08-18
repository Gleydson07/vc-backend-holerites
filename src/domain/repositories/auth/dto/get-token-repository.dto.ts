export class GetTokenRepositoryDto {
  login: string;
  password: string;
}

export class CognitoMetadata {
  httpStatusCode!: number;
  requestId!: string;
  extendedRequestId?: string;
  cfId?: string;
  attempts!: number;
  totalRetryDelay!: number;
}

export class AuthenticationResult {
  AccessToken!: string;
  ExpiresIn!: number;
  IdToken!: string;
  RefreshToken?: string;
  TokenType!: string;
}

export class CognitoAuthResponse {
  $metadata!: CognitoMetadata;
  AuthenticationResult?: AuthenticationResult;
  ChallengeParameters?: Record<string, string>;
}

export class ResponseGetTokenRepositoryDto {
  authenticationResult?: {
    accessToken?: string;
    expiresIn?: number;
    idToken?: string;
    refreshToken?: string;
  } | null;
  metadata?: {
    httpStatusCode: number;
    requestId: string;
    extendedRequestId?: string;
    cfId?: string;
  };
  challengeName?: string;
  challengeParams?: Record<string, string>;
  session?: string;
}
