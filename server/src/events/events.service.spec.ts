import { Test, TestingModule } from '@nestjs/testing';
import { DogadjajService } from './events.service';

describe('DogadjajService', () => {
  let service: DogadjajService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DogadjajService],
    }).compile();

    service = module.get<DogadjajService>(DogadjajService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
