import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserGroups } from '../../core';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusDto } from './dto/user-action.dto';
import { UserManagementGuard } from './guards/user-management.guard';
import { UsersService } from './users.service';

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

  @Put('/status')
  @Roles(UserGroups.ADMINISTRATORS, UserGroups.MANAGERS)
  @UseGuards(UserManagementGuard)
  toggleUserStatus(@Body() userStatusDto: UserStatusDto) {
    return this.usersService.toggleUserStatus(
      userStatusDto.login,
      userStatusDto.enabled,
    );
  }
}
