import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '@/domain/repositories/employee/employee.repository';
import { PrismaService } from '../prisma.service';
import { EmployeeEntity } from '@/domain/entities/employee.entity';
import { PrismaEmployeeMapper } from '../mappers/prisma-employee.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: EmployeeEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<EmployeeEntity | null> {
    const client = tx ?? this.prismaService;

    const employee = await client.employee.create({
      data: PrismaEmployeeMapper.toPrisma(data),
    });

    if (!employee) {
      return null;
    }

    return PrismaEmployeeMapper.toDomain(employee);
  }
}
