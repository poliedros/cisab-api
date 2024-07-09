import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { Types } from 'mongoose';

export type UserValidation = {
  _id: Types.ObjectId;
  email: string;
  roles: Role[];
  properties: Map<string, string>;
};

export type Payload = {
  email: string;
  sub: string;
  roles: Role[];
  county_id?: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneOrReturnNull({ email });

    if (!user) return null;

    const userPassword = user.password ? user.password : '';

    const isTheSamePassword = await bcrypt.compare(password, userPassword);

    if (user && isTheSamePassword) {
      this.logger.log(`User ${user.email} logged in successfully...`);
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: UserValidation) {
    let countyId: string;
    if (user.properties && user.properties.has('county_id'))
      countyId = user.properties.get('county_id');

    const payload: Payload = {
      email: user.email,
      sub: user._id.toString(),
      roles: user.roles,
      county_id: countyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async profile(payload: Payload) {
    const user = await this.usersService.findOneOrReturnNull({
      _id: payload.sub,
    });
    return {
      _id: user._id,
      email: user.email,
      roles: user.roles,
      name: user.name,
      surname: user.surname,
      county_id: payload.county_id,
    };
  }
}
