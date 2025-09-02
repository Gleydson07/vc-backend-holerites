import { TagRepository } from '@/domain/repositories/tag/tenant.repository';
import { CreateTagDto } from '../dto/create-tag.dto';
import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { TagEntity } from '@/domain/entities/tag.entity';
import { getColorByBgColor } from '@/core/utils/get-color-by-bg.util';

@Injectable()
export class DeleteTagByIdUsecase {
  private readonly logger = new Logger(DeleteTagByIdUsecase.name);
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(tenantId: string, tagId: string) {
    try {
      this.logger.log(`Starting delete tag by ID for tenant ${tenantId}`);

      if (!tenantId) {
        this.logger.warn(`Tenant ID is missing`);
        throw new BadRequestException('Tenant ID is missing');
      }

      if (!tagId) {
        this.logger.warn(`Tag ID is missing`);
        throw new BadRequestException('Tag ID is missing');
      }

      await this.tagRepository.delete(tagId);
      this.logger.log(`Tag with ID ${tagId} deleted successfully.`);
    } catch (error) {
      this.logger.error(
        `Failed to delete tag with ID ${tagId} for tenant ${tenantId}`,
        error.stack,
      );
      throw new BadRequestException('Failed to delete tag');
    }
  }
}
