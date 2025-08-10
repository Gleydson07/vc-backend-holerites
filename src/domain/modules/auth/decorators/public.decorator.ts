import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
