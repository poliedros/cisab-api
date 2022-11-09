import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/role.enum';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roles: Role[];

  @ApiProperty()
  properties?: Map<string, string>;
}
