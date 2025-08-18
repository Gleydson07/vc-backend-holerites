import { Injectable } from '@nestjs/common';
import { ResponseGetUserWithTenantsRepositoryDto } from './dto/get-user-with-tenants-repository.dto';
import {
  CreateUserRepositoryDto,
  ResponseCreateUserRepositoryDto,
} from './dto/create-user-repository.dto';
import {
  CreateUserProviderRepositoryDto,
  ResponseCreateUserProviderRepositoryDto,
} from './dto/create-user-provider-repository.dto';

@Injectable()
export abstract class UserRepository {
  abstract getUserWithTenants(
    login: string,
  ): Promise<ResponseGetUserWithTenantsRepositoryDto | null>;

  abstract create(
    data: CreateUserRepositoryDto,
  ): Promise<ResponseCreateUserRepositoryDto | null>;

  abstract createUserProvider(
    data: CreateUserProviderRepositoryDto,
  ): Promise<ResponseCreateUserProviderRepositoryDto>;
}
