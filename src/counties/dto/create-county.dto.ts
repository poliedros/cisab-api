import { ApiProperty } from '@nestjs/swagger';

export class CreateCountyAccountDto {
  @ApiProperty()
  user: string;

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
  account: CreateCountyAccountDto;

  @ApiProperty()
  county: CreateCountyCountyDto;

  @ApiProperty()
  accountable: CreateCountyAccountableDto;
}
