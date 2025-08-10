import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayslipsService } from './payslips.service';
import { CreatePayslipDto } from './dto/create-payslip.dto';
import { UpdatePayslipDto } from './dto/update-payslip.dto';

@Controller('payslips')
export class PayslipsController {
  constructor(private readonly payslipsService: PayslipsService) {}

  @Post()
  create(@Body() createPayslipDto: CreatePayslipDto) {
    return this.payslipsService.create(createPayslipDto);
  }

  @Get()
  findAll() {
    return this.payslipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payslipsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayslipDto: UpdatePayslipDto) {
    return this.payslipsService.update(+id, updatePayslipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payslipsService.remove(+id);
  }
}
