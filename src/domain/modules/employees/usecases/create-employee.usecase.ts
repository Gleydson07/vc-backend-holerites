import { EmployeeRepository } from '@/domain/repositories/employee/employee.repository';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { EmployeeEntity } from '@/domain/entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { isValidCPF } from '@/core/validators/cpf.validator';
import { generateRandomPassword } from '@/core/security/password-generator.util';
import * as bcrypt from 'bcrypt';
import {
  DEFAULT_ROUNDS,
  UserRepository,
} from '@/domain/repositories/user/user.repository';
import { TransactionManager } from '@/domain/managers/transaction/transaction-manager.manager';
import { UserEntity } from '@/domain/entities/user.entity';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly tm: TransactionManager,
  ) {}

  async execute(tenantId: string, data: CreateEmployeeDto) {
    try {
      if (!isValidCPF(data.cpf)) {
        throw new BadRequestException('CPF inválido');
      }

      const pass = generateRandomPassword(8);
      const passwordHash = await bcrypt.hash(pass, DEFAULT_ROUNDS);

      return await this.tm.run(
        async (tx) => {
          const userEntity = new UserEntity({
            tenantId,
            passwordHash,
            mustChangePassword: true,
            username: data.cpf,
            isActive: true,
          });

          const user = await this.userRepository.create(userEntity, tx);

          if (!user?.id) {
            throw new BadRequestException('Falha ao criar usuário');
          }

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
        },
        { timeout: 30000, maxWait: 15000 },
      );
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Falha ao efetuar cadastro do usuário.');
    }
  }
}
