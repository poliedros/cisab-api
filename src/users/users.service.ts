import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { CreateUserRequest } from './dtos/create-user-request.dto';
import { UserEntityFactory } from './factories/user-entity.factory';
import { UserSchemaFactory } from './factories/user-schema.factory';
import { UsersRepository } from './users.repository';
import { UpdateUserRequest } from './dtos/update-user-request.dto';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(email: string) {
    try {
      return await this.usersRepository.findOne({ email });
    } catch (err) {
      return null;
    }
  }

  async create({
    email,
    name,
    surname,
    password,
    roles,
    properties,
  }: CreateUserRequest) {
    const users = await this.usersRepository.find({
      email,
    });

    if (users.length !== 0) {
      throw new ConflictException('Email already exists');
    }

    const userEntity = await UserEntityFactory.create({
      _id: undefined,
      email,
      name,
      surname,
      password,
      roles,
      properties,
    });

    const userSchema = UserSchemaFactory.create(userEntity);

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(userSchema, {
        session,
      });

      await session.commitTransaction();
      this.logger.log(`user id ${user._id} saved`);

      return user;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async findByCountyId(countyId: string) {
    return await this.usersRepository.find({
      'properties.county_id': countyId,
    });
  }

  async update(updateUser: UpdateUserRequest) {
    const { _id, email, name, surname, password, properties } = updateUser;

    const users = await this.usersRepository.find({
      _id,
    });

    if (users.length === 0) {
      throw new NotFoundException('User doesnt exist');
    }

    const userEntity = await UserEntityFactory.create({
      _id,
      email,
      name,
      surname,
      password,
      roles: [Role.County],
      properties: new Map<string, string>(),
    });

    for (const [key, value] of properties) {
      userEntity.addProperty(key, value);
    }

    const userSchema = UserSchemaFactory.create(userEntity);
    delete userSchema._id;

    // const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.upsert({ _id }, userSchema);

      // await session.commitTransaction();
      this.logger.log(`user id ${user._id} updated`);

      return user;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
  }
}
