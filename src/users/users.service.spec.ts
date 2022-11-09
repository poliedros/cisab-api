import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Role } from '../auth/role.enum';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dtos/create-user.request.dto';
import { UsersRepository } from './users.repository';

describe('User Service', () => {
  let service: UsersService;
  const findOneMockFn = jest.fn();
  const findMockFn = jest.fn();
  const createMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  startTransactionMockFn.mockReturnValue(
    Promise.resolve({
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }),
  );

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findOne: findOneMockFn,
            create: createMockFn,
            find: findMockFn,
            startTransaction: startTransactionMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should find user', async () => {
    const user = {
      _id: '1',
      email: 'carlos@czar.dev',
      password: 'changeme',
      roles: [Role.Cisab],
    };

    findOneMockFn.mockReturnValue(user);

    const expectedUser = await service.findOne('carlos@czar.dev');

    expect(expectedUser).toEqual(user);
  });

  it('should create user with valid data', async () => {
    const createUserDto: CreateUserRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      roles: [Role.Admin],
    };

    findMockFn.mockReturnValue(() => Promise.resolve([]));
    createMockFn.mockReturnValue({
      _id: '1',
      password: '%4432',
      ...createUserDto,
    });

    const savedUser = await service.create(createUserDto);

    const { _id, email, roles } = savedUser;

    expect(_id).toEqual('1');
    expect(email).toEqual('carlos@czar.dev');
    expect(roles).toEqual([Role.Admin]);
  });

  it('should throw an exception if it cant save', async () => {
    const createUserDto: CreateUserRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      roles: [Role.Admin],
    };

    findMockFn.mockReturnValue(() => Promise.resolve([]));
    createMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      await service.create(createUserDto);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('shouldnt create user with duplicated email', async () => {
    const createUserDto: CreateUserRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      roles: [Role.Admin],
    };

    findMockFn.mockReturnValue(
      Promise.resolve([{ _id: '1', email: 'carlos@czar.dev' }]),
    );

    try {
      await service.create(createUserDto);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
    }
  });

  it('should hash a password', async () => {
    const result = await service.hashPassword('changeme');

    expect(result).not.toEqual('changeme');
  });
});
