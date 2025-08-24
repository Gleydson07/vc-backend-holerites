import { Injectable } from '@nestjs/common';
import { TransactionManager } from '@/domain/managers/transaction/transaction-manager.manager';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  run<T>(
    work: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: { timeout?: number; maxWait?: number },
  ): Promise<T> {
    const { timeout, maxWait } = options || {};
    return this.prisma.$transaction(async (tx) => work(tx), {
      timeout,
      maxWait,
    });
  }
}
