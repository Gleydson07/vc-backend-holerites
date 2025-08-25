import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import {
  DEFAULT_ROUNDS,
  UserRepository,
} from '@/domain/repositories/user/user.repository';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { TransactionManager } from '@/domain/managers/transaction/transaction-manager.manager';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@/domain/entities/user.entity';
import { StaffEntity } from '@/domain/entities/staff.entity';
import { isValidCPF } from '@/core/validators/cpf.validator';
import { generateRandomPassword } from '@/core/security/password-generator.util';

@Injectable()
export class CreateStaffUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly staffRepository: StaffRepository,
    private readonly tm: TransactionManager,
  ) {}

  async execute(tenantId: string, data: CreateStaffDto) {
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

          const staffEntity = new StaffEntity({
            tenantId,
            userId: user.id,
            cpf: data.cpf,
            role: data.role,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          });

          const staff = await this.staffRepository.create(staffEntity, tx);

          if (!staff?.id) {
            throw new BadRequestException('Falha ao criar staff');
          }

          // Será removido ao implementar envio de e-mail
          console.log(`Senha gerada para o usuário ${data.fullName}: ${pass}`);

          return {
            id: staff.id,
            fullName: staff.fullName,
            cpf: staff.cpf,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
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
