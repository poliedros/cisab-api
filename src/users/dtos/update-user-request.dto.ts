import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { CreateUserRequest } from './create-user-request.dto';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {
  @IsNotEmpty()
  @ApiProperty()
  _id: Types.ObjectId;
}
