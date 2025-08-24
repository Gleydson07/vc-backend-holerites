import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import {
  DEFAULT_ROUNDS,
  UserRepository,
} from '@/domain/repositories/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { TransactionManager } from '@/domain/managers/transaction/transaction-manager.manager';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@/domain/entities/user.entity';
import { StaffEntity } from '@/domain/entities/staff.entity';

@Injectable()
export class CreateStaffUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly staffRepository: StaffRepository,
    private readonly tm: TransactionManager,
  ) {}

  async execute(tenantId: string, data: CreateStaffDto) {
    try {
      const passwordHash = await bcrypt.hash(data.password, DEFAULT_ROUNDS);

      const result = await this.tm.run(
        async (tx) => {
          const userEntity = new UserEntity({
            tenantId,
            passwordHash,
            username: data.username,
            isActive: true,
          });

          const user = await this.userRepository.create(userEntity, tx);

          if (!user?.id) {
            throw new BadRequestException('Falha ao criar usuário');
          }

          const staffEntity = new StaffEntity({
            tenantId,
            userId: user.id,
            role: data.role,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          });

          const staff = await this.staffRepository.create(staffEntity, tx);

          if (!staff?.id) {
            throw new BadRequestException('Falha ao criar staff');
          }

          return {
            id: staff.id,
            fullName: staff.fullName,
            username: user.username,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
          };
        },
        { timeout: 30000, maxWait: 15000 },
      );

      return result;
    } catch (error: any) {
      throw new BadRequestException('Falha ao efetuar cadastro do usuário.');
    }
  }
}
