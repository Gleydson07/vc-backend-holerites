import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserAdminDto } from '../../users/dto/create-user-admin.dto';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  socialName: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateNested()
  @Type(() => CreateUserAdminDto)
  admin: CreateUserAdminDto;
}
