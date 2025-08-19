import { PartialType } from '@nestjs/mapped-types';
import { SignInDto } from '../usecases/dto/sign-in.dto';

export class UpdateAuthDto extends PartialType(SignInDto) {}
