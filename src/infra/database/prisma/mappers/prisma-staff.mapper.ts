import { Staff, StaffRole } from '@prisma/client';
import { StaffEntity, StaffProps } from '@/domain/entities/staff.entity';
import { StaffRoleType } from '@/domain/modules/staff/dto/create-staff.dto';

export class PrismaStaffMapper {
  private static fromStaffRoleType(role: StaffRoleType): StaffRole {
    switch (role) {
      case 'admin':
        return StaffRole.ADMIN;
      case 'manager':
        return StaffRole.MANAGER;
      default:
        throw new Error(`Role inválida: ${role}`);
    }
  }

  private static toStaffRoleType(role: StaffRole): StaffRoleType {
    switch (role) {
      case StaffRole.ADMIN:
        return 'admin';
      case StaffRole.MANAGER:
        return 'manager';
      default:
        throw new Error(`Role inválida: ${role}`);
    }
  }

  static toDomain(raw: Staff): StaffEntity {
    const props: StaffProps = {
      tenantId: raw.tenantId,
      userId: raw.userId,
      role: this.toStaffRoleType(raw.role),
      fullName: raw.fullName,
      email: raw.email ?? undefined,
      phone: raw.phone ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    };

    return new StaffEntity(props, raw.id);
  }

  static toPrisma(entity: StaffEntity): Staff {
    return {
      id: entity.id!,
      tenantId: entity.tenantId,
      userId: entity.userId,
      role: this.fromStaffRoleType(entity.role.toLowerCase() as StaffRoleType),
      fullName: entity.fullName,
      email: entity.email ?? null,
      phone: entity.phone ?? null,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
