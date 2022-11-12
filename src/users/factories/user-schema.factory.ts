import { UserEntity } from '../entities/user.entity';
import { User } from '../schemas/user.schema';

export class UserSchemaFactory {
  static create(userEntity: UserEntity): User {
    const user: User = {
      _id: userEntity.id,
      email: userEntity.email,
      name: userEntity.name,
      surname: userEntity.surname,
      password: userEntity.password,
      roles: userEntity.roles,
      properties: userEntity.properties,
    };

    return user;
  }
}
