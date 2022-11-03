import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './../enums/role.enum';
import * as bcrypt from 'bcrypt';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) return null;

    const userPassword = user.password ? user.password : '';

    const isTheSamePassword = await bcrypt.compare(password, userPassword);

    if (user && isTheSamePassword) {
      this.logger.log(`User ${user.username} logged in successfully...`);
      delete user.password;
      return user;
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
