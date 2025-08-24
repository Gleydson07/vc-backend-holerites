import { EmployeeRepository } from '@/domain/repositories/employee/employee.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeEntity } from '@/domain/entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(tenantId: string, data: CreateEmployeeDto) {
    try {
      const employeeEntity = new EmployeeEntity({
        tenantId,
        cpf: data.cpf,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });

      const employee = await this.employeeRepository.create(employeeEntity);

      if (!employee?.id) {
        throw new BadRequestException('Falha ao criar employee');
      }

      return {
        id: employee.id,
        fullName: employee.fullName,
        cpf: employee.cpf,
        email: employee.email,
        phone: employee.phone,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      };
    } catch (error: any) {
      throw new BadRequestException('Falha ao efetuar cadastro do usuário.');
    }
  }
}
