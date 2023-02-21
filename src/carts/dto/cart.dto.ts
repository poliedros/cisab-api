class CartMeasurementDto {
  name: string;
  value: string;
  unit: string;
}

export class CartProductDto {
  _id: string;
  name: string;
  norms: string[];
  categories: string[];
  photo_url: string;
  measurements: CartMeasurementDto[];
  quantity: number;
}

export class CartProductIdDto {
  product_id: string;
  quantity: number;
}

export class CartDto {
  _id: string;
  state: 'opened' | 'closed';
  products: CartProductDto[];
  user_id: string;
  updated_on: Date;
  product_ids: CartProductIdDto[];
  demandName: string;
  demand_id: string;
  userName: string;
  county_id: string;
}
