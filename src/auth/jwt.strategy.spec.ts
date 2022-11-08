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
      username: 'carlos',
      roles: [Role.Cisab],
    });

    expect(payload).toEqual({
      id: payload.id,
      username: payload.username,
      roles: [Role.Cisab],
    });
  });
});
