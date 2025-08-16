import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async enabledShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
