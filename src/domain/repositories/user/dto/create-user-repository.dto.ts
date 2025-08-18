export class CreateUserRepositoryDto {
  username: string;
  nickname: string;
  email: string;
  userProviderId: string;
}

export class ResponseCreateUserRepositoryDto {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  userProviderId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
