import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Role } from './../enums/role.enum';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';

describe('User Service', () => {
  let usersService: UsersService;
  const findOneMock = jest.fn();
  const newUserModelMock = jest.fn();

  beforeEach(async () => {});

  it('should find user', async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: findOneMock,
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    const user = {
      id: '1',
      username: 'carlos',
      password: 'changeme',
      roles: [Role.Cisab],
    };

    findOneMock.mockReturnValue({ exec: () => user });

    const expectedUser = await usersService.findOne('carlos');

    expect(expectedUser).toEqual(user);
  });

  it('should create user with valid data', async () => {
    function mockUserModel(dto: any) {
      this.data = dto;
      this.findOne = findOneMock;
      this.save = () => {
        return this.data;
      };
    }

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    const createUserDto: CreateUserDto = {
      username: 'carlos',
      password: 'changeme',
      roles: [Role.Admin],
    };

    newUserModelMock.mockReturnValue({
      save: () => createUserDto,
    });

    const savedUser = await usersService.create(createUserDto);

    const { username, password, roles } = savedUser;

    expect(username).toEqual('carlos');
    expect(password).not.toEqual('changeme');
    expect(roles).toEqual([Role.Admin]);
  });
});
