class GetCartMeasurementResponse {
  name: string;
  value: string;
  unit: string;
}

class GetCartProductResponse {
  _id: string;
  name: string;
  norms: string[];
  categories: string[];
  photo_url: string;
  measurements: GetCartMeasurementResponse[];
}
export class GetCartResponse {
  _id: string;
  state: string;
  products: GetCartProductResponse[];
  user_id: string;
  updated_on: Date;
}
