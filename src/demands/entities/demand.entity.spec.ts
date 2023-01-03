import { DemandState } from '../enums/demand-state.enum';
import { DemandEntity } from './demand.entity';

describe('demand entity', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return that it is open', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const demand = new DemandEntity();
    demand.name = 'Demand 01-1';
    demand.start_date = today;
    demand.end_date = tomorrow;
    demand.product_ids = [];

    expect(demand.open()).toBeTruthy();
  });

  it('should return that it is closed when the date is expired', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(yesterday.getDate() - 1);

    const demand = new DemandEntity();
    demand.name = 'Demand 01-1';
    demand.start_date = dayBeforeYesterday;
    demand.end_date = yesterday;
    demand.product_ids = [];

    expect(demand.open()).toBeFalsy();
  });

  it('should return that it is closed when it is draft or blocked', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const demand = new DemandEntity();
    demand.name = 'Demand 01-1';
    demand.start_date = today;
    demand.end_date = tomorrow;
    demand.product_ids = [];
    demand.state = DemandState.draft;

    expect(demand.open()).toBeFalsy();

    demand.state = DemandState.blocked;
    expect(demand.open()).toBeFalsy();
  });
});
