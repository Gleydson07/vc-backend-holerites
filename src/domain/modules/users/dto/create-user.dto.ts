import { UserRole } from '@/core/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'EmailOrPhone', async: false })
class EmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email || obj.phone);
  }
  defaultMessage(args: ValidationArguments) {
    return 'É obrigatório informar pelo menos email ou telefone.';
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, {
    message: 'Login deve conter exatamente 11 dígitos',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+\d{8,15}$/, {
    message: 'O telefone deve estar no formato +5511912345678',
  })
  phone?: string;

  @IsString()
  @IsEnum(UserRole, {
    message: `Cada papel deve ser um dos seguintes: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}
