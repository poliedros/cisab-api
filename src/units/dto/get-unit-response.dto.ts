import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUnitRequest } from './create-unit-request.dto';

export class GetUnitResponse extends PartialType(CreateUnitRequest) {
  @ApiProperty()
  _id: string;
}
