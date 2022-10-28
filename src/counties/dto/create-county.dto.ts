import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateCountyAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class CreateCountyCountyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  state: string;

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

  @ApiProperty()
  address: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  site: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  socialMedias: string;
}

export class CreateCountyAccountableDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  job: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  socialMedias: string;

  @ApiProperty()
  note: string;
}

export class CreateCountyDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCountyAccountDto)
  account: CreateCountyAccountDto;

  @ApiProperty()
  county: CreateCountyCountyDto;

  @ApiProperty()
  accountable: CreateCountyAccountableDto;
}
