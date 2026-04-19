import { Test, TestingModule } from '@nestjs/testing';
import { TimoviController } from './teams.controller';
import { TimoviService } from './teams.service';

describe('TimoviController', () => {
  let controller: TimoviController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimoviController],
      providers: [TimoviService],
    }).compile();

    controller = module.get<TimoviController>(TimoviController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
