import { Controller, Post, Body } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  // constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    // return this.employeesService.create(createEmployeeDto);
  }
}
