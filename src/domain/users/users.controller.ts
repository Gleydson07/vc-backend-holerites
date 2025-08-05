import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusDto } from './dto/user-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserManagementGuard } from './guards/user-management.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserGroups } from '../../core';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserGroups.ADMINISTRATORS, UserGroups.MANAGERS)
  @UseGuards(UserManagementGuard)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('/status')
  @Roles(UserGroups.ADMINISTRATORS, UserGroups.MANAGERS)
  @UseGuards(UserManagementGuard)
  toggleUserStatus(@Body() userStatusDto: UserStatusDto) {
    return this.usersService.toggleUserStatus(
      userStatusDto.cpf,
      userStatusDto.enabled,
    );
  }
}
