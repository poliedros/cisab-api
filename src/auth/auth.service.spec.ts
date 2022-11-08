import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { Role } from './role.enum';
import { User } from './../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  const findOneMockFn = jest.fn();
  const signMockFn = jest.fn();
  const userModelMockFn = jest.fn();
  const bcryptSpy = jest.spyOn(bcrypt, 'compare');

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: findOneMockFn,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMockFn,
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: userModelMockFn,
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
      roles: [Role.Cisab],
    };

    findOneMockFn.mockReturnValue(Promise.resolve(user));
    bcryptSpy.mockReturnValue(Promise.resolve(true));

    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser.id).toEqual(user.id);
    expect(validateUser.username).toEqual(user.username);
  });

  it('should return null', async () => {
    findOneMockFn.mockReturnValue({});
    bcryptSpy.mockReturnValue(Promise.resolve(false));
    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser).toBeNull();
  });

  it('should login user', async () => {
    signMockFn.mockReturnValue('3a');

    const token = await service.login({
      id: '3',
      username: 'carlos',
      roles: [Role.Cisab],
    });

    expect(token).toEqual({ access_token: '3a' });
  });
});
