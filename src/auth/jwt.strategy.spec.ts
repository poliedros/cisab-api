import { Role } from './role.enum';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });
  it('should validate', async () => {
    const payload = await jwtStrategy.validate({
      sub: '3',
      email: 'carlos@czar.dev',
      roles: [Role.Cisab],
    });

    expect(payload).toEqual({
      county_id: undefined,
      email: payload.email,
      roles: [Role.Cisab],
      sub: payload.sub,
    });
  });
});
