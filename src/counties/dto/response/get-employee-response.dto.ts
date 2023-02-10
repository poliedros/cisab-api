import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateEmployeeRequest } from '../request/create-employee-request.dto';

export class GetEmployeeResponse extends PartialType(CreateEmployeeRequest) {
  @ApiProperty()
  _id: Types.ObjectId;
}
