import { Test, TestingModule } from '@nestjs/testing';
import { CountiesController } from './counties.controller';
import { CountiesService } from './counties.service';

describe('CountiesController', () => {
  let controller: CountiesController;
  const createMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountiesController],
      providers: [
        { provide: CountiesService, useValue: { create: createMockFn } },
      ],
    }).compile();

    controller = module.get<CountiesController>(CountiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
