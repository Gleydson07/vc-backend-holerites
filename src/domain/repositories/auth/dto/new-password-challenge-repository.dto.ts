export class NewPasswordChallengeRepositoryDto {
  login: string;
  newPassword: string;
  session: string;
}

export class ResponseNewPasswordChallengeRepositoryDto {
  accessToken?: string;
  expiresIn?: number;
  idToken?: string;
  refreshToken?: string;
}
