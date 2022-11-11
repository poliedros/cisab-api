import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateCountyUserRequest } from 'src/counties/dto/request/update-county-user-request.dto';
import { CreateUserRequest } from './dtos/create-user.request.dto';
import { User } from './schemas/user.schema';
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

  async create(createUserRequest: CreateUserRequest) {
    const { password } = createUserRequest;

    const users = await this.usersRepository.find({
      email: createUserRequest.email,
    });

    if (users.length !== 0) {
      throw new ConflictException('Email already exists');
    }

    createUserRequest.password = await this.hashPassword(password);

    const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.create(createUserRequest, {
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

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async findByCountyId(countyId: string) {
    return await this.usersRepository.find({
      'properties.county_id': countyId,
    });
  }

  async update(updateCountyUser: UpdateCountyUserRequest) {
    const { _id, password } = updateCountyUser;
    console.log(_id);

    const users = await this.usersRepository.find({
      _id,
    });

    if (users.length === 0) {
      throw new NotFoundException('User doesnt exist');
    }

    updateCountyUser.password = await this.hashPassword(password);

    const userToUpdate = users[0];
    userToUpdate.email = updateCountyUser.email;
    userToUpdate.name = updateCountyUser.name;
    userToUpdate.surname = updateCountyUser.surname;
    userToUpdate.password = updateCountyUser.password;
    delete userToUpdate._id;

    // const session = await this.usersRepository.startTransaction();
    try {
      const user = await this.usersRepository.upsert({ _id }, userToUpdate);

      // await session.commitTransaction();
      this.logger.log(`user id ${user._id} updated`);

      return user;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
  }
}
