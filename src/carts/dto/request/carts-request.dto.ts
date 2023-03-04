import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { IsObjectId } from '../../../libs/class-validator-mongo-object-id';

export class CartsProductRequest {
  @ApiProperty()
  @IsObjectId()
  product_id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CartsRequest {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartsProductRequest)
  products: CartsProductRequest[];

  @ApiProperty()
  @IsObjectId()
  demand_id: string;
}
