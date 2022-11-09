import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/role.enum';

export class CreateUserRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roles: Role[];

  @ApiProperty()
  properties?: Map<string, string>;
}
