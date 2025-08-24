import { Injectable } from '@nestjs/common';
import {
  CreateEmployeeRepositoryDto,
  ResponseCreateEmployeeRepositoryDto,
} from './dto/create-employee-repository.dto';

@Injectable()
export abstract class EmployeeRepository {
  abstract create(
    data: CreateEmployeeRepositoryDto,
  ): Promise<ResponseCreateEmployeeRepositoryDto | null>;
}
