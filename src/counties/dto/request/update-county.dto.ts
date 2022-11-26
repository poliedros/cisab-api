import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ContactDto, InfoDto } from './create-county.dto';

export class UpdateCountyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => InfoDto)
  info: InfoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;
}
