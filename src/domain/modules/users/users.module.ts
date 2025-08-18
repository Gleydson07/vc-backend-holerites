import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { PrismaUserRepository } from '@/infra/database/prisma/repositories/prisma-user.repository';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
