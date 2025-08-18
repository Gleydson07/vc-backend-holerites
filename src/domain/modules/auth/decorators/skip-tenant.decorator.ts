import { SetMetadata } from '@nestjs/common';

export const IS_TENANT_OPTIONAL_KEY = 'hjf342yur4538f3@#$@vbf2';
export const SkipTenant = () => SetMetadata(IS_TENANT_OPTIONAL_KEY, true);
