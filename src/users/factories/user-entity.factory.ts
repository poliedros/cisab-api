import { Types } from 'mongoose';
import { Role } from '../../auth/role.enum';
import { UserEntity } from '../entities/user.entity';

type UserEntityFactoryProps = {
  _id?: Types.ObjectId | undefined;
  email: string;
  name?: string;
  surname?: string;
  password?: string;
  roles: Role[];
  properties?: Map<string, string>;
};
export class UserEntityFactory {
  static async create({
    _id = null,
    email,
    name,
    surname,
    password,
    roles,
    properties,
  }: UserEntityFactoryProps): Promise<UserEntity> {
    const user = new UserEntity({
      email,
      name,
      surname,
      roles,
      properties,
    });

    if (_id) user.id = _id;

    if (password) await user.setPassword(password);

    return user;
  }
}
