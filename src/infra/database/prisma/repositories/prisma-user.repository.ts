import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateUserRepositoryDto,
  ResponseCreateUserRepositoryDto,
} from '@/domain/repositories/user/dto/create-user-repository.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateUserRepositoryDto,
    tx?: Prisma.TransactionClient,
  ): Promise<ResponseCreateUserRepositoryDto | null> {
    const client = tx ?? this.prismaService;
    const user = await client.user.create({
      data,
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
