import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_JWT_KEY || 'secretKey',
    });
  }

  async validate(payload: Payload) {
    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      county_id: payload.county_id,
    };
  }
}
