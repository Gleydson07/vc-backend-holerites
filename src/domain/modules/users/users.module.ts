import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserManagementGuard } from './guards/user-management.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UserManagementGuard],
})
export class UsersModule {}
