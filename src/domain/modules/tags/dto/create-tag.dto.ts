import { TagScopeEnum } from '@/domain/repositories/tag/dto/create-tag-repository.dto';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  bgColor: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(TagScopeEnum), {
    message: `O scope deve ser um dos seguintes valores: ${Object.values(TagScopeEnum).join(', ')}`,
  })
  scope: TagScopeEnum;
}
