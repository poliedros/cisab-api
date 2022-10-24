import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCountyDto } from './create-county.dto';

export class GetCountyDto extends PartialType(CreateCountyDto) {
  @ApiProperty()
  id: string;
}
