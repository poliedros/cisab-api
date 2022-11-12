import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountyDto } from './create-county.dto';
import { Types } from 'mongoose';

// TODO: don't trust partial type to bring validation type through ValidationPipe
export class UpdateCountyDto extends PartialType(CreateCountyDto) {
  @ApiProperty()
  _id: Types.ObjectId;
}
