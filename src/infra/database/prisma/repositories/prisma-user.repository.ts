import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { UserEntity } from '@/domain/entities/user.entity';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: UserEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null> {
    const client = tx ?? this.prismaService;

    const user = await client.user.create({
      data: PrismaUserMapper.toPrisma(data),
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
