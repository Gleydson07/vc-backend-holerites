import { Injectable } from '@nestjs/common';
import {
  GetTokenRepositoryDto,
  ResponseGetTokenRepositoryDto,
} from './dto/get-token-repository.dto';
import {
  NewPasswordChallengeRepositoryDto,
  ResponseNewPasswordChallengeRepositoryDto,
} from './dto/new-password-challenge-repository.dto';

@Injectable()
export abstract class AuthRepository {
  abstract getToken(
    data: GetTokenRepositoryDto,
  ): Promise<ResponseGetTokenRepositoryDto>;

  abstract newPasswordChallenge(
    data: NewPasswordChallengeRepositoryDto,
  ): Promise<ResponseNewPasswordChallengeRepositoryDto>;
}
