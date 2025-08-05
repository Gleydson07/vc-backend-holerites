import { Module } from '@nestjs/common';
import { PayslipsService } from './payslips.service';
import { PayslipsController } from './payslips.controller';

@Module({
  controllers: [PayslipsController],
  providers: [PayslipsService],
})
export class PayslipsModule {}
