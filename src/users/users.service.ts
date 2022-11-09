import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dtos/create-user.request.dto';
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

    const user = await this.usersRepository.find({
      email: createUserRequest.email,
    });

    if (user.length !== 0) {
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
}
