import { TransactionManager } from '@/domain/managers/transaction/transaction-manager.manager';
import { Module } from '@nestjs/common';
import { PrismaTransactionManager } from '../../../infra/database/prisma/repositories/prisma-transaction.manager';

@Module({
  providers: [
    {
      provide: TransactionManager,
      useClass: PrismaTransactionManager,
    },
  ],
  exports: [TransactionManager],
})
export class TransactionModule {}
