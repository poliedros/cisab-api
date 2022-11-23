import { Role } from '../../auth/role.enum';
import { UserEntity } from './user.entity';

describe('user entity', () => {
  let entity: UserEntity;

  beforeEach(() => {
    entity = new UserEntity({
      email: 'email@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      roles: [Role.Admin],
      properties: new Map<string, string>(),
    });
  });

  it('should hash a password', async () => {
    const password = 'password';
    await entity.setPassword(password);

    expect(entity).not.toEqual(password);
  });
});
