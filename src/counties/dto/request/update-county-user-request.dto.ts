import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { CreateCountyUserRequest } from './create-county-user-request.dto';

export class UpdateCountyUserRequest extends PartialType(
  CreateCountyUserRequest,
) {
  @IsNotEmpty()
  @ApiProperty()
  _id: Types.ObjectId;
}
