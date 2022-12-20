import { Test, TestingModule } from '@nestjs/testing';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';

describe('DemandsController', () => {
  let controller: DemandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandsController],
      providers: [DemandsService],
    }).compile();

    controller = module.get<DemandsController>(DemandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
