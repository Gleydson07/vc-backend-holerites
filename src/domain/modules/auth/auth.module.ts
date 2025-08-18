import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthRepository } from '@/domain/repositories/auth/auth.repository';
import { PrismaAuthRepository } from '@/infra/database/prisma/repositories/prisma-auth.repository';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { UsersModule } from '../users/users.module';
import { FirstAccessChallengeUseCase } from './usecases/first-access-challenge.usecase';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [
    SignInUseCase,
    FirstAccessChallengeUseCase,
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
