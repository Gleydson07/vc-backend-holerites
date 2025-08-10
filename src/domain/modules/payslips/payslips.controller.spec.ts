import { Test, TestingModule } from '@nestjs/testing';
import { PayslipsController } from './payslips.controller';
import { PayslipsService } from './payslips.service';

describe('PayslipsController', () => {
  let controller: PayslipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayslipsController],
      providers: [PayslipsService],
    }).compile();

    controller = module.get<PayslipsController>(PayslipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
