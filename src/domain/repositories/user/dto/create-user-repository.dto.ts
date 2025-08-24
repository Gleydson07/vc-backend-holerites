import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRepositoryDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}

export class ResponseCreateUserRepositoryDto {
  id: string;
  tenantId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date | null;
}
