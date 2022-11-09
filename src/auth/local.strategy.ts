import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService, UserValidation } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserValidation> {
    console.log(email, password);
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.log(`User id ${email} has tried to log in and failed.`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
