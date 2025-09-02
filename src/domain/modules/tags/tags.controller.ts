import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { CreateManyTagsUsecase } from './usecases/create-many-tags.usecase';
import { FindAllTagsUsecase } from './usecases/find-all-tags.usecase';
import { TenantId } from '@/core/decorators/tenant-id.decorator';
import { FindAllTagsDto } from './dto/find-all-tags.dto';

@Controller()
export class TagsController {
  constructor(
    private readonly createManyTagsUsecase: CreateManyTagsUsecase,
    private readonly findAllTagsUsecase: FindAllTagsUsecase,
  ) {}

  @Post()
  async createManyTags(
    @Body('tags') tags: CreateTagDto[],
    @TenantId() tenantId: string,
  ) {
    await this.createManyTagsUsecase.execute(tenantId, tags);
  }

  @Get()
  async findAllTags(
    @Query() filters: FindAllTagsDto,
    @TenantId() tenantId: string,
  ) {
    return this.findAllTagsUsecase.execute(tenantId, filters);
  }
}
