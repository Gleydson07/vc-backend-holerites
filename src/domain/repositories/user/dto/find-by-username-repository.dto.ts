export class ResponseFindByUsernameUserRepositoryDto {
  id: string;
  username: string;
  nickname: string;
  email: string;
  userProviderId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
