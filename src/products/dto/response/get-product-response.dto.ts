import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductRequest } from '../request/create-product-request.dto';

export class GetProductResponse extends PartialType(CreateProductRequest) {
  @ApiProperty()
  photo_url: string;
}
