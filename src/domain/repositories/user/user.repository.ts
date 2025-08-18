import { Injectable } from '@nestjs/common';
import { ResponseGetUserWithTenantsRepositoryDto } from './dto/get-user-with-tenants.dto';

@Injectable()
export abstract class UserRepository {
  abstract getUserWithTenants(
    login: string,
  ): Promise<ResponseGetUserWithTenantsRepositoryDto | null>;
}
