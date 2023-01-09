import { Test, TestingModule } from '@nestjs/testing';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { DemandState } from './enums/demand-state.enum';

describe('DemandsController', () => {
  let controller: DemandsController;
  const createMockFn = jest.fn();
  const findAllMockFn = jest.fn();
  const findOneMockFn = jest.fn();

  class TestError extends Error {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandsController],
      providers: [
        {
          provide: DemandsService,
          useValue: {
            create: createMockFn,
            findAll: findAllMockFn,
            findOne: findOneMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<DemandsController>(DemandsController);
  });

  it('should create demand', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const name = 'Bombas hidraulicas';

    const createDemandRequest: CreateDemandRequest = {
      name,
      start_date: today,
      end_date: tomorrow,
      draft: true,
      product_ids: [],
    };

    createMockFn.mockReturnValue(
      Promise.resolve({
        name,
        start_date: today,
        end_date: tomorrow,
        state: DemandState.draft,
        product_ids: [],
      }),
    );

    const demand = await controller.create(createDemandRequest);

    expect(demand.name).toEqual('Bombas hidraulicas');
    expect(demand.start_date).toEqual(today);
    expect(demand.end_date).toEqual(tomorrow);
    expect(demand.state).toEqual(DemandState.draft);
    expect(demand.product_ids).toEqual([]);
  });

  it('should capture an error in creation a demand', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const name = 'Bombas hidraulicas';

    const createDemandRequest: CreateDemandRequest = {
      name,
      start_date: today,
      end_date: tomorrow,
      draft: true,
      product_ids: [],
    };

    createMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await controller.create(createDemandRequest);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should find demands with filters', async () => {
    findAllMockFn.mockReturnValue(Promise.resolve([{ name: 'demand 01-1' }]));

    const res = await controller.findAll(
      '01-01-2022',
      '01-01-2023',
      'demand 01-1',
      [],
      undefined,
    );

    expect(res[0].name).toEqual('demand 01-1');
  });

  it('should find one demand', async () => {
    findOneMockFn.mockReturnValue(Promise.resolve({ name: 'demand 01-1' }));

    const res = await controller.findOne('123abc');

    expect(res.name).toEqual('demand 01-1');
  });
});
