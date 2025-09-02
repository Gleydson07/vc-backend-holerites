import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TagRepository } from '@/domain/repositories/tag/tenant.repository';
import { PrismaTagMapper } from '../mappers/prisma-tag.mapper';
import { TagEntity } from '@/domain/entities/tag.entity';
import { findAllTagsRepositoryDto } from '@/domain/repositories/tag/dto/find-tenant-by-cnpj-repository.dto';

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(data: TagEntity[]): Promise<void> {
    const prismaTags = data.map((tag) => PrismaTagMapper.toPrisma(tag));

    await this.prismaService.tag.createMany({
      data: prismaTags,
    });
  }

  async findAll(data: findAllTagsRepositoryDto): Promise<TagEntity[]> {
    const filters = {
      tenantId: data.tenantId,
    };

    if (data.scope) {
      Object.assign(filters, { scope: data.scope });
    }

    if (data.title) {
      Object.assign(filters, {
        title: {
          contains: data.title,
          mode: 'insensitive',
        },
      });
    }

    const tags = await this.prismaService.tag.findMany({
      where: filters,
    });

    if (!tags) {
      return [];
    }

    return tags.map((tag) => PrismaTagMapper.toDomain(tag));
  }
}
