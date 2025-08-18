export class CreateUserProviderRepositoryDto {
  username: string;
  nickname: string;
  email: string;
  provisionalPassword: string;
}

export class ResponseCreateUserProviderRepositoryDto {
  userProviderId: string;
  provisionalPassword: string;
}
