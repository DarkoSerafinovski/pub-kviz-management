import { Test, TestingModule } from '@nestjs/testing';
import { SezoneService } from './seasons.service';

describe('SezoneService', () => {
  let service: SezoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SezoneService],
    }).compile();

    service = module.get<SezoneService>(SezoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
