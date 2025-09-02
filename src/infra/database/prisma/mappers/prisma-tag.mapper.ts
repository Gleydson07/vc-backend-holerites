import { TagEntity, TagProps } from '@/domain/entities/tag.entity';
import { TagScopeEnum } from '@/domain/repositories/tag/dto/create-tag-repository.dto';
import { Tag as PrismaTag, TagScope } from '@prisma/client';

export class PrismaTagMapper {
  static fromTagScopeEnum(scope: TagScopeEnum): TagScope {
    switch (scope) {
      case TagScopeEnum.EMPLOYEE:
        return TagScope.EMPLOYEE;
      case TagScopeEnum.PAYSLIP:
        return TagScope.PAYSLIP;
      case TagScopeEnum.STAFF:
        return TagScope.STAFF;
      default:
        throw new Error(`Scope inválida: ${scope}`);
    }
  }

  private static toTagScopeEnum(scope: TagScope): TagScopeEnum {
    switch (scope) {
      case TagScope.EMPLOYEE:
        return TagScopeEnum.EMPLOYEE;
      case TagScope.PAYSLIP:
        return TagScopeEnum.PAYSLIP;
      case TagScope.STAFF:
        return TagScopeEnum.STAFF;
      default:
        throw new Error(`Scope inválida: ${scope}`);
    }
  }

  static toDomain(raw: PrismaTag): TagEntity {
    const props: TagProps = {
      tenantId: raw.tenantId,
      title: raw.title,
      textColor: raw.textColor,
      bgColor: raw.bgColor,
      scope: this.toTagScopeEnum(raw.scope),
    };

    return new TagEntity(props, raw.id);
  }

  static toPrisma(entity: TagEntity): PrismaTag {
    return {
      id: entity.id!,
      tenantId: entity.tenantId,
      title: entity.title,
      textColor: entity.textColor,
      bgColor: entity.bgColor,
      scope: this.fromTagScopeEnum(entity.scope.toLowerCase() as TagScopeEnum),
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
