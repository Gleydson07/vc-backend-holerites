import { UserRole } from '@/core/enums';

export class CreateUserTenantRepositoryDto {
  tenantId: string;
  userId: string;
  userRole: UserRole;
}

export class ResponseCreateUserTenantRepositoryDto {
  tenantId: string;
  userId: string;
  userRole: UserRole;
  createdAt: Date;
  updatedAt: Date | null;
}
