import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MeasureRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  unit: string;
}

export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  measurements: MeasureRequest[];

  @ApiProperty()
  norms: string[];

  @ApiProperty()
  code: string;

  @ApiProperty()
  accessory_ids: string[];

  @ApiProperty()
  categories: string[];

  @ApiProperty()
  notes: string;
}
