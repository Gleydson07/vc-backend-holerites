import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { ResponseGetUserWithTenantsRepositoryDto } from '@/domain/repositories/user/dto/get-user-with-tenants.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserWithTenants(
    login: string,
  ): Promise<ResponseGetUserWithTenantsRepositoryDto | null> {
    return this.prismaService.user.findFirst({
      where: {
        username: login,
      },
      select: {
        id: true,
        isMaster: true,
        username: true,
        nickname: true,
        userProviderId: true,
        userTenants: {
          select: {
            tenantId: true,
            accessProfile: true,
          },
        },
      },
    });
  }
}
