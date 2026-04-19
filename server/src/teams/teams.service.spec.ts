import { Test, TestingModule } from '@nestjs/testing';
import { TimoviService } from './teams.service';

describe('TimoviService', () => {
  let service: TimoviService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimoviService],
    }).compile();

    service = module.get<TimoviService>(TimoviService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
