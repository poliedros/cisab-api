import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { Role } from './../enums/role.enum';
import { User } from './../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  const findOneMock = jest.fn();
  const signMock = jest.fn();
  const userModelMock = jest.fn();
  const bcryptSpy = jest.spyOn(bcrypt, 'compare');

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
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
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

    findOneMock.mockReturnValue(Promise.resolve(user));
    bcryptSpy.mockReturnValue(true);

    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser.id).toEqual(user.id);
    expect(validateUser.username).toEqual(user.username);
  });

  it('should return null', async () => {
    findOneMock.mockReturnValue({});
    bcryptSpy.mockReturnValue(false);
    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser).toBeNull();
  });

  it('should login user', async () => {
    signMock.mockReturnValue('3a');

    const token = await service.login({
      id: '3',
      username: 'carlos',
      roles: [Role.Cisab],
    });

    expect(token).toEqual({ access_token: '3a' });
  });
});
