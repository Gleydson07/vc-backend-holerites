import {
  EmployeeEntity,
  EmployeeProps,
} from '@/domain/entities/employee.entity';
import { Employee } from '@prisma/client';

export class PrismaEmployeeMapper {
  static toDomain(raw: Employee): EmployeeEntity {
    const props: EmployeeProps = {
      tenantId: raw.tenantId,
      userId: raw.userId || undefined,
      cpf: raw.cpf,
      fullName: raw.fullName,
      email: raw.email ?? undefined,
      phone: raw.phone ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    };

    return new EmployeeEntity(props, raw.id);
  }

  static toPrisma(entity: EmployeeEntity): Employee {
    return {
      id: entity.id!,
      tenantId: entity.tenantId,
      userId: entity?.userId || null,
      cpf: entity.cpf,
      fullName: entity.fullName,
      email: entity.email ?? null,
      phone: entity.phone ?? null,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
