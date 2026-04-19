import { Test, TestingModule } from '@nestjs/testing';
import { DogadjajController } from './events.controller';
import { DogadjajService } from './events.service';

describe('DogadjajController', () => {
  let controller: DogadjajController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogadjajController],
      providers: [DogadjajService],
    }).compile();

    controller = module.get<DogadjajController>(DogadjajController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
