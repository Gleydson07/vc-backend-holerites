import { UserEntity, UserProps } from '@/domain/entities/user.entity';
import { User as PrismaUser, User } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    const props: UserProps = {
      tenantId: raw.tenantId,
      username: raw.username,
      passwordHash: raw.passwordHash,
      mustChangePassword: raw.mustChangePassword!,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    };

    return new UserEntity(props, raw.id);
  }

  static toPrisma(entity: UserEntity): User {
    return {
      id: entity.id!,
      tenantId: entity.tenantId,
      username: entity.username,
      passwordHash: entity.passwordHash,
      mustChangePassword: entity.mustChangePassword!,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
