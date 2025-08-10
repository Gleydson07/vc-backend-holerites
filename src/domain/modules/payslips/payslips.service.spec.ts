import { Test, TestingModule } from '@nestjs/testing';
import { PayslipsService } from './payslips.service';

describe('PayslipsService', () => {
  let service: PayslipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayslipsService],
    }).compile();

    service = module.get<PayslipsService>(PayslipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
