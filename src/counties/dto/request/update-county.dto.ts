import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountyDto } from './create-county.dto';
import { Types } from 'mongoose';

export class UpdateCountyDto extends PartialType(CreateCountyDto) {
  @ApiProperty()
  _id: Types.ObjectId;
}
