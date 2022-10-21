import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Role } from './../enums/role.enum';
import { User } from './schemas/user.schema';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('User Service', () => {
  let usersService: UsersService;
  const findOneMock = jest.fn();

  beforeEach(async () => {
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
  });

  it('should find user', async () => {
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
});
