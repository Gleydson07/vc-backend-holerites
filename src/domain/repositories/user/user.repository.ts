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
import { ResponseFindByUsernameUserRepositoryDto } from './dto/find-by-username-repository.dto';

@Injectable()
export abstract class UserRepository {
  abstract getUserWithTenants(
    data: string,
  ): Promise<ResponseGetUserWithTenantsRepositoryDto | null>;

  abstract create(
    data: CreateUserRepositoryDto,
  ): Promise<ResponseCreateUserRepositoryDto | null>;

  abstract findByUserProviderId(
    data: string,
  ): Promise<ResponseFindByUsernameUserRepositoryDto | null>;

  abstract createUserProvider(
    data: CreateUserProviderRepositoryDto,
  ): Promise<ResponseCreateUserProviderRepositoryDto>;

  abstract getUserProviderId(data: string): Promise<string | null>;
}
