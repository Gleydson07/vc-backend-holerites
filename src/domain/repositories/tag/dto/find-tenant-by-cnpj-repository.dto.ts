import { TagScopeEnum } from './create-tag-repository.dto';

export class findAllTagsRepositoryDto {
  tenantId: string;
  title?: string;
  scope?: TagScopeEnum;
}
