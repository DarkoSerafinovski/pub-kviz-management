import { Test, TestingModule } from '@nestjs/testing';
import { RezultatiService } from './results.service';

describe('RezultatiService', () => {
  let service: RezultatiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RezultatiService],
    }).compile();

    service = module.get<RezultatiService>(RezultatiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
