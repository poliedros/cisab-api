import { Test, TestingModule } from '@nestjs/testing';
import { DemandsRepository } from './demands.repository';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { DemandState } from './enums/demand-state.enum';

describe('DemandsService', () => {
  let service: DemandsService;
  const createDemandMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemandsService,
        {
          provide: DemandsRepository,
          useValue: {
            create: createDemandMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<DemandsService>(DemandsService);
  });

  it('should create demand', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const name = 'Demand 01-1';

    const createDemandRequest: CreateDemandRequest = {
      name,
      start_date: today,
      end_date: tomorrow,
      draft: true,
      product_ids: [],
    };

    createDemandMockFn.mockReturnValue(
      Promise.resolve({
        name,
        start_date: today,
        end_date: tomorrow,
        state: DemandState.draft,
        product_ids: [],
      }),
    );

    const demand = await service.create(createDemandRequest);

    expect(demand.name).toEqual(name);
    expect(demand.start_date).toEqual(today);
    expect(demand.end_date).toEqual(tomorrow);
    expect(demand.state).toEqual(DemandState.draft);
    expect(demand.product_ids).toEqual([]);
  });
});
