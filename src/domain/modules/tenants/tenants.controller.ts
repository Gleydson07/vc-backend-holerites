import { Body, Controller, Post } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreateTenantWithUserAdminUseCase } from './usecases/create-tenant-with-user-admin.usecase';

@Controller()
export class TenantsController {
  constructor(
    private readonly createTenantWithUserAdminUseCase: CreateTenantWithUserAdminUseCase,
  ) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.createTenantWithUserAdminUseCase.execute(createTenantDto);
  }

  // @Get()
  // @SkipTenant()
  // findAll() {
  //   return this.tenantsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tenantsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
  //   return this.tenantsService.update(id, updateTenantDto);
  // }

  // @Delete(':id')
  // @Roles('master')
  // remove(@Param('id') id: string) {
  //   return this.tenantsService.remove(id);
  // }

  // @Patch(':id/deactivate')
  // @Roles('master')
  // deactivate(@Param('id') id: string) {
  //   return this.tenantsService.deactivate(id);
  // }
}
