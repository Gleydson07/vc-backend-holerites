import { SetMetadata } from '@nestjs/common';

export const IS_TENANT_OPTIONAL_KEY = 'IS_TENANT_OPTIONAL';
export const SkipTenant = () => SetMetadata(IS_TENANT_OPTIONAL_KEY, true);
