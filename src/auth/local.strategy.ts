import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService, UserValidation } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserValidation> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      this.logger.log(`User id ${username} has tried to log in and failed.`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
