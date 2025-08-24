import { Injectable } from '@nestjs/common';
import {
  CreateUserRepositoryDto,
  ResponseCreateUserRepositoryDto,
} from './dto/create-user-repository.dto';
import { Prisma } from '@prisma/client';

export const SALT = 12;

@Injectable()
export abstract class UserRepository {
  abstract create(
    data: CreateUserRepositoryDto,
    tx?: Prisma.TransactionClient,
  ): Promise<ResponseCreateUserRepositoryDto | null>;
}
