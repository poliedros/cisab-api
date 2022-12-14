import { Test, TestingModule } from '@nestjs/testing';
import { DemandsRepository } from './demands.repository';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { DemandState } from './enums/demand-state.enum';

function getTodayAndTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [today, tomorrow];
}

describe('DemandsService', () => {
  let service: DemandsService;
  const createDemandMockFn = jest.fn();
  const paginateDemandMockFn = jest.fn();
  const findOneDemandMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemandsService,
        {
          provide: DemandsRepository,
          useValue: {
            create: createDemandMockFn,
            paginate: paginateDemandMockFn,
            findOne: findOneDemandMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<DemandsService>(DemandsService);
  });

  it('should create demand', async () => {
    const [today, tomorrow] = getTodayAndTomorrow();
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

  it('should find demands with filters', async () => {
    const [today, tomorrow] = getTodayAndTomorrow();

    paginateDemandMockFn.mockReturnValue(
      Promise.resolve([{ name: 'demand 01-1' }]),
    );

    const demands = await service.findAll({
      name: 'name',
      start_date: today.toString(),
      end_date: tomorrow.toString(),
      states: [],
      page: 0,
    });

    expect(demands[0].name).toEqual('demand 01-1');
  });

  it('should find demand', async () => {
    findOneDemandMockFn.mockReturnValue(
      Promise.resolve({ name: 'demand 01-1' }),
    );

    const demand = await service.findOne('1ab2');

    expect(demand.name).toEqual('demand 01-1');
  });
});
