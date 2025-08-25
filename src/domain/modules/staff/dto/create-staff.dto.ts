import { TransformPhone } from '@/core/transformers/phone.transformer';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export const STAFF_ROLES = ['admin', 'manager'] as const;
export type StaffRoleType = (typeof STAFF_ROLES)[number];

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(STAFF_ROLES, {
    message: `A role deve ser um dos seguintes valores: ${STAFF_ROLES.join(', ')}`,
  })
  role: StaffRoleType;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @TransformPhone()
  @Matches(/^\+55\d{10,11}$/i, {
    message:
      'O phone deve estar no formato +55DDXXXXXXXXX (código do país + DDD + número, 10 ou 11 dígitos após +55)',
  })
  phone?: string;
}
