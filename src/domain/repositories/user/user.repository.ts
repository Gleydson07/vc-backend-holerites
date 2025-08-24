import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserEntity } from '@/domain/entities/user.entity';

export const DEFAULT_ROUNDS = 12;

@Injectable()
export abstract class UserRepository {
  abstract create(
    data: UserEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<UserEntity | null>;
}
