import { Test, TestingModule } from '@nestjs/testing';
import { SezoneController } from './seasons.controller';
import { SezoneService } from './seasons.service';

describe('SezoneController', () => {
  let controller: SezoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SezoneController],
      providers: [SezoneService],
    }).compile();

    controller = module.get<SezoneController>(SezoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
