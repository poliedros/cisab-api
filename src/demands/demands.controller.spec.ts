import { Test, TestingModule } from '@nestjs/testing';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { DemandState } from './enums/demand-state.enum';

describe('DemandsController', () => {
  let controller: DemandsController;
  const createMockFn = jest.fn();

  class TestError extends Error {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandsController],
      providers: [
        {
          provide: DemandsService,
          useValue: {
            create: createMockFn,
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
});
