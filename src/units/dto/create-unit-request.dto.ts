import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
