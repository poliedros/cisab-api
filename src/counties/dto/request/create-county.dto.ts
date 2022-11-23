import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreateInfoDto {
  @ApiProperty()
  mayor: string;

  @ApiProperty()
  population: string;

  @ApiProperty()
  flag: string;

  @ApiProperty()
  anniversary: string;

  @ApiProperty()
  distanceToCisab: string;

  @ApiProperty()
  note: string;
}

export class CreateContactDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  speakTo: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  socialMedia: string;

  @ApiProperty()
  note: string;
}

export class CreateCountyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateInfoDto)
  info: CreateInfoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateContactDto)
  contact: CreateContactDto;
}
