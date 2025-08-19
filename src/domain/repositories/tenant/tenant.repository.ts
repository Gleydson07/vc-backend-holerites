import { Injectable } from '@nestjs/common';
import {
  CreateTenantRepositoryDto,
  ResponseCreateTenantRepositoryDto,
} from './dto/create-tenant-repository.dto';
import { ResponseFindTenantByCnpjRepositoryDto } from './dto/find-tenant-by-cnpj-repository.dto';

@Injectable()
export abstract class TenantRepository {
  abstract create(
    data: CreateTenantRepositoryDto,
  ): Promise<ResponseCreateTenantRepositoryDto | null>;

  abstract findByCnpj(
    data: string,
  ): Promise<ResponseFindTenantByCnpjRepositoryDto | null>;
}
