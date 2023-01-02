export enum CreateDemandStateEnum {
  draft,
  opened,
}

export class CreateDemandRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  product_ids: [];
  state: CreateDemandStateEnum;
}
