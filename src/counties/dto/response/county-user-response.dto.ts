import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateCountyUserRequest } from './../request/create-county-user-request.dto';

export class CountyUserResponse extends PartialType(CreateCountyUserRequest) {
  @ApiProperty()
  _id: Types.ObjectId;
}
