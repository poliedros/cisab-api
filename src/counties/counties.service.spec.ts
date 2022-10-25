import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CountiesService } from './counties.service';
import { County } from './schemas/county.schema';

describe('CountiesService', () => {
  let service: CountiesService;
  const findOneMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountiesService,
        {
          provide: getModelToken(County.name),
          useValue: { findOne: findOneMockFn },
        },
      ],
    }).compile();

    service = module.get<CountiesService>(CountiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
