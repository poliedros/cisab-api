import { ApiProperty } from '@nestjs/swagger';

export class CartsProductRequest {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;
}

export class CartsRequest {
  @ApiProperty()
  products: CartsProductRequest[];

  @ApiProperty()
  demand_id: string;
}
