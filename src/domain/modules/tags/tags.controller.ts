import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { CreateManyTagsUsecase } from './usecases/create-many-tags.usecase';
import { FindAllTagsUsecase } from './usecases/find-all-tags.usecase';
import { TenantId } from '@/core/decorators/tenant-id.decorator';
import { FindAllTagsDto } from './dto/find-all-tags.dto';
import { DeleteTagByIdUsecase } from './usecases/delete-by-id-tag.usecase';

@Controller()
export class TagsController {
  constructor(
    private readonly createManyTagsUsecase: CreateManyTagsUsecase,
    private readonly findAllTagsUsecase: FindAllTagsUsecase,
    private readonly deleteTagByIdUsecase: DeleteTagByIdUsecase,
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTagById(
    @Param('id') tagId: string,
    @TenantId() tenantId: string,
  ) {
    await this.deleteTagByIdUsecase.execute(tenantId, tagId);
  }
}
