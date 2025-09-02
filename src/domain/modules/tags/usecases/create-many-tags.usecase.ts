import { TagRepository } from '@/domain/repositories/tag/tenant.repository';
import { CreateTagDto } from '../dto/create-tag.dto';
import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { TagEntity } from '@/domain/entities/tag.entity';
import { getColorByBgColor } from '@/core/utils/get-color-by-bg.util';

@Injectable()
export class CreateManyTagsUsecase {
  private readonly logger = new Logger(CreateManyTagsUsecase.name);
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(tenantId: string, tags: CreateTagDto[]) {
    try {
      this.logger.log(`Starting create many tags for tenant ${tenantId}`);

      if (!tenantId) {
        this.logger.warn(`Tenant ID is missing`);
        throw new BadRequestException('Tenant ID is missing');
      }

      if (!Array.isArray(tags) || tags.length === 0) {
        this.logger.warn(`Tags array is empty or invalid`);
        throw new BadRequestException('Tags array is empty or invalid');
      }

      this.logger.log(`Mounting tags to create.`);
      const mountTagsToCreate: TagEntity[] = tags.map((tag) => {
        this.logger.log(
          `Getting text color for tag ${tag.title} with bgColor: ${tag.bgColor}`,
        );
        const textColor = getColorByBgColor(tag.bgColor);
        return new TagEntity({ ...tag, tenantId, textColor });
      });

      this.logger.log(
        `Creating ${mountTagsToCreate.length} tags for tenant ${tenantId}.`,
      );
      await this.tagRepository.createMany(mountTagsToCreate);
    } catch (error) {
      this.logger.error(
        `Failed to create tags for tenant ${tenantId}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create tags');
    }
  }
}
