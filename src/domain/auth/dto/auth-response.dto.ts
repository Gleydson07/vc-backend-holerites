export interface AuthTokens {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
  TokenType?: string;
  ExpiresIn?: number;
}

export interface SignInSuccessResponse {
  success: true;
  tokens: AuthTokens;
}

export interface SignInChallengeResponse {
  success: false;
  challengeName: string;
  session: string;
}

export type SignInResponse = SignInSuccessResponse | SignInChallengeResponse;

export interface NewPasswordChallengeResponse {
  success: true;
  tokens: AuthTokens;
}

export interface CreateUserResponse {
  UserSub?: string;
  Username?: string;
  UserAttributes?: Array<{
    Name?: string;
    Value?: string;
  }>;
  UserStatus?: string;
}
