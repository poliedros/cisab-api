import { DemandState } from '../enums/demand-state.enum';

export class DemandEntity {
  name: string;

  start_date: Date;

  end_date: Date;

  product_ids: [];

  state: DemandState;

  open(): boolean {
    const today = new Date();
    if (this.start_date < today && today < this.end_date) return true;

    return false;
  }
}
