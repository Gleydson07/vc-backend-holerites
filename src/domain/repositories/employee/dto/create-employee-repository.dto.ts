import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TransformPhone } from '@/core/transformers/phone.transformer';

export class CreateEmployeeRepositoryDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

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

export class ResponseCreateEmployeeRepositoryDto {
  id: string;
  tenantId: string;
  cpf: string;
  fullName: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date | null;
}
