import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/role.enum';
import { UpdateCountyUserRequest } from 'src/counties/dto/request/update-county-user-request.dto';
import { CreateUserRequest } from './dtos/create-user.request.dto';
import { UserEntity } from './entities/user.entity';
import { UserEntityFactory } from './factories/user-entity.factory';
import { UserSchemaFactory } from './factories/user-schema.factory';
import { UsersRepository } from './users.repository';

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

  async updateCountyUser(updateCountyUser: UpdateCountyUserRequest) {
    const { _id, email, name, surname, password, properties } =
      updateCountyUser;

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

    for (const property in properties) {
      console.log(`key: ${property} value: ${properties[property]}`);
      userEntity.addProperty(property, properties[property]);
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

function isEmpty(str) {
  return !str || str.length === 0;
}
