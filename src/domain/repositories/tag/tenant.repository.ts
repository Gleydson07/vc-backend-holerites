import { Injectable } from '@nestjs/common';
import { CreateTagRepositoryDto } from './dto/create-tag-repository.dto';
import { findAllTagsRepositoryDto } from './dto/find-tenant-by-cnpj-repository.dto';
import { TagEntity } from '@/domain/entities/tag.entity';

@Injectable()
export abstract class TagRepository {
  abstract createMany(data: CreateTagRepositoryDto[]): Promise<void>;

  abstract findAll(data: findAllTagsRepositoryDto): Promise<TagEntity[]>;
}
