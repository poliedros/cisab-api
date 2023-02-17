class CartMeasurementDto {
  name: string;
  value: string;
  unit: string;
}

class CartProductDto {
  _id: string;
  name: string;
  norms: string[];
  categories: string[];
  photo_url: string;
  measurements: CartMeasurementDto[];
  quantity: number;
}

class CartProductIdDto {
  product_id: string;
  quantity: number;
}

export class CartDto {
  _id: string;
  state: string;
  products: CartProductDto[];
  user_id: string;
  updated_on: Date;
  product_ids: CartProductIdDto[];
}
