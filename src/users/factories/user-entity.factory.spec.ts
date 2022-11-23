import { UserEntityFactory } from './user-entity.factory';
import { Role } from '../../auth/role.enum';

describe('User entity Factor', () => {
  it('should not hash password if it`s empty', async () => {
    const email = 'myemail@czar.dev';
    const roles = [Role.Cisab];

    const userEntity = await UserEntityFactory.create({ email, roles });
    expect(userEntity.password).toBeUndefined();
  });

  it('should hash password if it`s empty', async () => {
    const email = 'myemail@czar.dev';
    const roles = [Role.Cisab];
    const password = 'password';

    const userEntity = await UserEntityFactory.create({
      email,
      roles,
      password,
    });
    expect(userEntity.password).not.toEqual('password');
  });
});
