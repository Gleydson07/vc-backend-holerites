import { Controller, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards()
export class TenantsController {
  constructor() {}

  // @Post()
  // @Roles('master')
  // @SkipTenant()
  // create(@Body() createTenantDto: CreateTenantDto) {
  //   return this.tenantsService.create(createTenantDto);
  // }

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
