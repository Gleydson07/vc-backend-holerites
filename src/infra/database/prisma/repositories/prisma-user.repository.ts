import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/domain/repositories/user/user.repository';
import { ResponseGetUserWithTenantsRepositoryDto } from '@/domain/repositories/user/dto/get-user-with-tenants-repository.dto';
import { PrismaService } from '../prisma.service';
import {
  CreateUserRepositoryDto,
  ResponseCreateUserRepositoryDto,
} from '@/domain/repositories/user/dto/create-user-repository.dto';
import { ConfigService } from '@nestjs/config';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  CreateUserProviderRepositoryDto,
  ResponseCreateUserProviderRepositoryDto,
} from '@/domain/repositories/user/dto/create-user-provider-repository.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    const region = this.configService.get<string>('COGNITO_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS Cognito configuration values');
    }

    this.cognitoClient = new CognitoIdentityProviderClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async create(
    data: CreateUserRepositoryDto,
  ): Promise<ResponseCreateUserRepositoryDto | null> {
    const user = await this.prismaService.user.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: null,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      userProviderId: user.userProviderId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUserProvider(
    data: CreateUserProviderRepositoryDto,
  ): Promise<ResponseCreateUserProviderRepositoryDto> {
    const { username, email, provisionalPassword } = data;

    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      Username: username,
      TemporaryPassword: provisionalPassword,
      UserAttributes: [{ Name: 'email', Value: email || '' }],
      MessageAction: 'SUPPRESS',
    });

    const tempPassword = createUserCommand.input.TemporaryPassword;

    const createUserResponse: AdminCreateUserCommandOutput =
      await this.cognitoClient.send(createUserCommand);

    const sub = createUserResponse.User?.Attributes?.find(
      (attr) => attr.Name === 'sub',
    )?.Value;

    return {
      userProviderId: sub ?? '',
      provisionalPassword: tempPassword ?? '',
    };
  }

  async getUserWithTenants(
    login: string,
  ): Promise<ResponseGetUserWithTenantsRepositoryDto | null> {
    return this.prismaService.user.findFirst({
      where: {
        username: login,
      },
      select: {
        id: true,
        isMaster: true,
        username: true,
        nickname: true,
        userProviderId: true,
        userTenants: {
          select: {
            tenantId: true,
            accessProfile: true,
          },
        },
      },
    });
  }
}
