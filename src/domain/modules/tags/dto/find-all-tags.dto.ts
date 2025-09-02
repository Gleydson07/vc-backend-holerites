import { TagScopeEnum } from '@/domain/repositories/tag/dto/create-tag-repository.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllTagsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(TagScopeEnum, {
    message: `O scope deve ser um dos seguintes valores: ${Object.values(TagScopeEnum).join(', ')}`,
  })
  scope?: TagScopeEnum;
}
