import { ApiProperty } from '@nestjs/swagger';

class GetProductIdsResponse {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;
}

class GetCartMeasurementResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  unit: string;
}

class GetCartProductResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  norms: string[];

  @ApiProperty()
  categories: string[];

  @ApiProperty()
  photo_url: string;

  @ApiProperty({ type: () => [GetCartMeasurementResponse] })
  measurements: GetCartMeasurementResponse[];

  @ApiProperty()
  quantity: number;
}

export class GetCartResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  state: string;

  @ApiProperty({ type: () => [GetCartProductResponse] })
  products: GetCartProductResponse[];

  @ApiProperty({ type: () => [GetProductIdsResponse] })
  product_ids: GetProductIdsResponse[];

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  updated_on: Date;
}
