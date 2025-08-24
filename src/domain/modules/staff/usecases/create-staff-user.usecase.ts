import { StaffRepository } from '@/domain/repositories/staff/staff.repository';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffUserDto } from '../dto/create-staff.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class CreateStaffUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly staffRepository: StaffRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(tenantId: string, data: CreateStaffUserDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await this.userRepository.create(
          {
            tenantId,
            username: data.username,
            passwordHash: data.passwordHash,
          },
          tx,
        );

        if (!user) {
          throw new BadRequestException('Falha ao criar usuário');
        }

        const staff = await this.staffRepository.create(
          {
            tenantId,
            userId: user.id,
            role: data.role,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          },
          tx,
        );

        if (!staff) {
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
      });

      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
