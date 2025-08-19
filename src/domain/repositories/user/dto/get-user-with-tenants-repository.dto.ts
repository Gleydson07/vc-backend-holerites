export class ResponseGetUserWithTenantsRepositoryDto {
  id: string;
  username: string;
  nickname: string;
  userProviderId: string;
  userTenants: Array<{
    tenantId: string;
    accessProfile: string;
  }>;
}
