import { Injectable } from '@nestjs/common';
import {
  CreateTenantRepositoryDto,
  ResponseCreateTenantRepositoryDto,
} from './dto/create-tenant-repository.dto';

@Injectable()
export abstract class TenantRepository {
  abstract create(
    data: CreateTenantRepositoryDto,
  ): Promise<ResponseCreateTenantRepositoryDto | null>;
}
