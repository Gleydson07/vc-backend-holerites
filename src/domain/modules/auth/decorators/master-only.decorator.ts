import { SetMetadata } from '@nestjs/common';

export const IS_MASTER_ONLY_KEY = 'IS_MASTER_ONLY';
export const MasterOnly = () => SetMetadata(IS_MASTER_ONLY_KEY, true);
