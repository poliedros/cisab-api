import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountyDto } from '../request/create-county.dto';

export class GetCountyDto extends PartialType(CreateCountyDto) {
  @ApiProperty()
  _id: string;
}
