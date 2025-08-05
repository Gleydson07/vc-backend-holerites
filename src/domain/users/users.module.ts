import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserManagementGuard } from './guards/user-management.guard';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UserManagementGuard],
})
export class UsersModule {}
