import { Injectable } from '@nestjs/common';
import {
  CreateUserTenantRepositoryDto,
  ResponseCreateUserTenantRepositoryDto,
} from './dto/create-user-tenant-repository.dto';

@Injectable()
export abstract class UserTenantRepository {
  abstract create(
    data: CreateUserTenantRepositoryDto,
  ): Promise<ResponseCreateUserTenantRepositoryDto | null>;
}
