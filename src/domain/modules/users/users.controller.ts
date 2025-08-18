import { Controller } from '@nestjs/common';

@Controller()
export class UsersController {
  constructor() {}

  // @Post()
  // @Roles(UserRole.ADMINISTRATORS, UserRole.MANAGERS)
  // createUser(
  //   @Body() createUserDto: CreateUserDto,
  //   @TenantId() tenantId: string,
  // ) {
  //   return this.usersService.create(tenantId, createUserDto);
  // }
}
