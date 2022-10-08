import { Injectable } from '@nestjs/common';
import { Role } from './../enums/role.enum';

export class User {
  id: string;
  username: string;
  password: string;
  roles: Role[];
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      username: 'carlos',
      password: 'changeme',
      roles: [Role.Cisab],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username == username);
  }
}
