import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserGroups } from '../../../core/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UserStatusDto } from './dto/user-action.dto';
import { UserManagementGuard } from './guards/user-management.guard';
import { UsersService } from './users.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserGroups.ADMINISTRATORS, UserGroups.MANAGERS)
  listUsersByGroup(@Query() listUsersDto: ListUsersDto) {
    return this.usersService.listUsersByGroup(listUsersDto.grupo, {
      cursor: listUsersDto.cursor,
      limit: listUsersDto.limit || 10,
    });
  }

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
