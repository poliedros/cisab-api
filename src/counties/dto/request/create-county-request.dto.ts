import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class InfoDto {
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

export class ContactDto {
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

export class CreateCountyRequest {
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

  @ApiProperty()
  county_id?: Types.ObjectId;
}
