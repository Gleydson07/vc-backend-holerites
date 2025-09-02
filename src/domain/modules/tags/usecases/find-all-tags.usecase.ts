import { TagRepository } from '@/domain/repositories/tag/tenant.repository';
import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { FindAllTagsDto } from '../dto/find-all-tags.dto';
import { shortingTenantId } from '@/core/utils/short-tenant-id.util';

@Injectable()
export class FindAllTagsUsecase {
  private readonly logger = new Logger(FindAllTagsUsecase.name);
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(tenantId: string, filters: FindAllTagsDto) {
    const shortedTID = shortingTenantId(tenantId);

    try {
      this.logger.log(`Starting finding all tags for tenant ${tenantId}.`);

      if (!tenantId) {
        this.logger.warn(`Tenant ID is missing`);
        throw new BadRequestException('Tenant ID is missing');
      }

      this.logger.log(
        `Finding all tags for tenant ${shortedTID} with filters.`,
      );
      const tags = await this.tagRepository.findAll({ ...filters, tenantId });

      this.logger.log(`Finding all tags for tenant ${shortedTID} finished.`);
      return tags.map((tag) => ({
        id: tag.id,
        title: tag.title,
        textColor: tag.textColor,
        bgColor: tag.bgColor,
        scope: tag.scope,
        createdAt: tag.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to find tags for tenant ${shortedTID}`,
        error.stack,
      );

      throw new BadRequestException('Failed to find tags');
    }
  }
}
