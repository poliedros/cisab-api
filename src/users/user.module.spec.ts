import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('Health Module', () => {
  let usersService: UsersService;
  const findOneMock = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
      // providers: [
      //   {
      //     provide: UsersService,
      //     useValue: {
      //       findOne: findOneMock,
      //     },
      //   },
      // ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should find user', async () => {
    const user = await usersService.findOne('carlos');

    expect(user).toEqual({
      id: '1',
      username: 'carlos',
      password: 'changeme',
    });
  });
});
