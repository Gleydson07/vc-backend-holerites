import { IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
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

  @ValidateNested()
  @Type(() => CreateUserAdminDto)
  admin: CreateUserAdminDto;
}
