import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  Matches,
} from 'class-validator';
import { TransformPhone } from '@/core/transformers/phone.transformer';

export const STAFF_ROLES = ['admin', 'manager'] as const;
export type StaffRoleType = (typeof STAFF_ROLES)[number];

export class CreateStaffRepositoryDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(STAFF_ROLES, {
    message: `A role deve ser um dos seguintes valores: ${STAFF_ROLES.join(', ')}`,
  })
  role: StaffRoleType;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @TransformPhone()
  @Matches(/^\+55\d{10,11}$/i, {
    message:
      'O phone deve estar no formato +55DDXXXXXXXXX (código do país + DDD + número, 10 ou 11 dígitos após +55)',
  })
  phone?: string;
}

export class ResponseCreateStaffRepositoryDto {
  id: string;
  tenantId: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: StaffRoleType;
  createdAt: Date;
  updatedAt: Date | null;
}
