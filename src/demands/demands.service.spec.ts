import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products/products.service';
import { DemandsRepository } from './demands.repository';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { UpdateDemandRequest } from './dto/request/update-demand-request.dto';
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
  const upsertMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
  const findAllProductsMockfn = jest.fn();

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
            upsert: upsertMockFn,
            deleteOne: deleteOneMockFn,
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findAll: findAllProductsMockfn,
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

    findAllProductsMockfn.mockReturnValue(
      Promise.resolve([{ _id: 'as', accessory_ids: [{ _id: 'asbd' }] }]),
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

  it('should find demands with products', async () => {
    const [today, tomorrow] = getTodayAndTomorrow();
    const demandName = 'demand 01-1';

    paginateDemandMockFn.mockReturnValue(
      Promise.resolve([
        {
          _id: 'h2',
          name: demandName,
          start_date: today,
          end_date: tomorrow,
          product_ids: ['1'],
          created_on: today,
        },
      ]),
    );

    findAllProductsMockfn.mockReturnValue(
      Promise.resolve([
        {
          _id: '1',
          accessory_ids: [{ _id: 'asbd' }],
        },
      ]),
    );

    const demands = await service.findAllWithProducts({
      name: 'name',
      start_date: today.toString(),
      end_date: tomorrow.toString(),
      states: [],
      page: 0,
    });

    expect(demands[0].name).toEqual(demandName);
    expect(demands[0].start_date).toEqual(today);
    expect(demands[0].end_date).toEqual(tomorrow);
    expect(demands[0].products.length).toBeGreaterThan(0);
    expect(demands[0].created_on).toEqual(today);
  });

  it('should find demand', async () => {
    findOneDemandMockFn.mockReturnValue(
      Promise.resolve({ name: 'demand 01-1' }),
    );

    const demand = await service.findOne('1ab2');

    expect(demand.name).toEqual('demand 01-1');
  });

  it('should update demand', async () => {
    const [today, tomorrow] = getTodayAndTomorrow();

    const request: UpdateDemandRequest = {
      name: 'updated demand 01-1',
      start_date: today,
      end_date: tomorrow,
      product_ids: [],
    };

    upsertMockFn.mockReturnValue('upsert');

    const res = await service.update('id', request);

    expect(res).toEqual('upsert');
  });

  it('should remove demand', async () => {
    deleteOneMockFn.mockReturnValue('remove');

    const res = await service.remove('id');

    expect(res).toEqual('remove');
  });
});
