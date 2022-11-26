import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountyRequest } from '../request/create-county-request.dto';

export class GetCountyResponse extends PartialType(CreateCountyRequest) {
  @ApiProperty()
  _id: string;
}
