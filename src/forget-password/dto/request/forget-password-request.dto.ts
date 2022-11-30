import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}
