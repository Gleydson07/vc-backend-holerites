import { TransformPhone } from '@/core/transformers/phone.transformer';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

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
