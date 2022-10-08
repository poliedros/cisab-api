import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from './../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const findOneMock = jest.fn();
  const signMock = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: findOneMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user', async () => {
    const user: User = {
      id: '3',
      username: 'carlos',
      password: 'test',
    };

    findOneMock.mockReturnValue(Promise.resolve(user));

    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser.id).toEqual(user.id);
    expect(validateUser.username).toEqual(user.username);
  });

  it('should return null', async () => {
    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser).toBeNull();
  });

  it('should login user', async () => {
    signMock.mockReturnValue('3a');

    const token = await service.login({ id: '3', username: 'carlos' });

    expect(token).toEqual({ access_token: '3a' });
  });
});
