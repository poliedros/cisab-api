import { ApiProperty } from '@nestjs/swagger';
import { Role } from './../../enums/role.enum';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roles: Role[];
}
