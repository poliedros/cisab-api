import { DemandState } from '../enums/demand-state.enum';

export class DemandEntity {
  name: string;

  start_date: Date;

  end_date: Date;

  product_ids: [];

  state: DemandState | undefined;

  open(): boolean {
    if (
      this.state &&
      (this.state === DemandState.blocked || this.state === DemandState.draft)
    )
      return false;

    const today = new Date();
    if (this.start_date < today && today < this.end_date) return true;

    return false;
  }
}
