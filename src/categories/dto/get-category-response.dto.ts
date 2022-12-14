import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryRequest } from './create-category-request.dto';

export class GetCategoryResponse extends PartialType(CreateCategoryRequest) {
  @ApiProperty()
  _id: string;
}
