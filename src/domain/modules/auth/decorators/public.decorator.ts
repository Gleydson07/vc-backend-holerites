import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'JSD#983FDWE!DSNJKJHRETI9';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
