import { PartialType } from '@nestjs/mapped-types';
import { CreatePayslipDto } from './create-payslip.dto';

export class UpdatePayslipDto extends PartialType(CreatePayslipDto) {}
