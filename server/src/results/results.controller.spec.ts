import { Test, TestingModule } from '@nestjs/testing';
import { RezultatiController } from './results.controller';
import { RezultatiService } from './results.service';

describe('RezultatiController', () => {
  let controller: RezultatiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RezultatiController],
      providers: [RezultatiService],
    }).compile();

    controller = module.get<RezultatiController>(RezultatiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
