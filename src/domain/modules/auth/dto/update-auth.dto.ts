import { PartialType } from '@nestjs/mapped-types';
import { SignInDto } from '../../../repositories/auth/dto/get-token-repository.dto';

export class UpdateAuthDto extends PartialType(SignInDto) {}
