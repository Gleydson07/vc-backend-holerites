import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagRepository } from '@/domain/repositories/tag/tenant.repository';
import { PrismaTagRepository } from '@/infra/database/prisma/repositories/prisma-tag.repository';
import { FindAllTagsUsecase } from './usecases/find-all-tags.usecase';
import { CreateManyTagsUsecase } from './usecases/create-many-tags.usecase';

@Module({
  controllers: [TagsController],
  providers: [
    CreateManyTagsUsecase,
    FindAllTagsUsecase,
    {
      provide: TagRepository,
      useClass: PrismaTagRepository,
    },
  ],
})
export class TagsModule {}
