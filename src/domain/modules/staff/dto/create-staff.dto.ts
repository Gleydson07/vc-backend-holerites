import { TransformPhone } from '@/core/transformers/phone.transformer';
import {
  STAFF_ROLES,
  type StaffRoleType,
} from '@/domain/repositories/staff/dto/create-staff-repository.dto';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateStaffUserDto {
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
  username: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;

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
