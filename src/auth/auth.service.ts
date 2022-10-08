import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums/role.enum';
import { UsersService } from './../users/users.service';

export type UserValidation = {
  id: string;
  username: string;
  roles: Role[];
};

export type Payload = {
  username: string;
  sub: string;
  roles: Role[];
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserValidation> {
    const user = await this.usersService.findOne(username);

    if (user && user.password == password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserValidation) {
    const payload: Payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
