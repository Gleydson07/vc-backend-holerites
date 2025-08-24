import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '@/domain/repositories/employee/employee.repository';
import { PrismaService } from '../prisma.service';
import {
  CreateEmployeeRepositoryDto,
  ResponseCreateEmployeeRepositoryDto,
} from '@/domain/repositories/employee/dto/create-employee-repository.dto';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateEmployeeRepositoryDto,
  ): Promise<ResponseCreateEmployeeRepositoryDto | null> {
    const employee = await this.prismaService.employee.create({
      data: data,
    });

    if (!employee) {
      return null;
    }

    return {
      id: employee.id,
      tenantId: employee.tenantId,
      fullName: employee.fullName,
      cpf: employee.cpf,
      email: employee.email ?? undefined,
      phone: employee?.phone ?? undefined,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }
}
