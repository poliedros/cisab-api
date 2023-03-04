import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { AuthService, Payload } from './auth.service';
import { Role } from './role.enum';
import { User } from './../users/schemas/user.schema';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  const findOneOrReturnNullMockFn = jest.fn();
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
            findOneOrReturnNull: findOneOrReturnNullMockFn,
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
    const idString = '63599affb40135010840911b';
    const id = new Types.ObjectId(idString);
    const user: User = {
      _id: id,
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'test',
      roles: [Role.Cisab],
    };

    findOneOrReturnNullMockFn.mockReturnValue(Promise.resolve(user));
    bcryptSpy.mockReturnValue(Promise.resolve(true));

    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser._id).toEqual(user._id);
    expect(validateUser.email).toEqual(user.email);
  });

  it('should return null', async () => {
    findOneOrReturnNullMockFn.mockReturnValue({});
    bcryptSpy.mockReturnValue(Promise.resolve(false));
    const validateUser = await service.validateUser('carlos', 'test');

    expect(validateUser).toBeNull();
  });

  it('should login user', async () => {
    signMockFn.mockReturnValue('3a');

    const idString = '63599affb40135010840911b';
    const id = new Types.ObjectId(idString);
    const properties = new Map<string, string>();
    properties.set('county_id', '1a');

    const token = await service.login({
      _id: id,
      email: 'carlos@czar.dev',
      roles: [Role.Cisab],
      properties: properties,
    });

    expect(token).toEqual({ access_token: '3a' });
  });

  it('should return user profile', async () => {
    const user = {
      _id: '1a',
      email: 'carlos',
      roles: [],
      name: 'carlos',
      surname: 'czar',
      properties: {},
    };

    findOneOrReturnNullMockFn.mockReturnValue(Promise.resolve(user));

    const res = await service.profile({
      email: 'carlos',
      roles: [],
      sub: '12',
      county_id: undefined,
    } as Payload);

    expect(res._id).toEqual(user._id);
    expect(res.email).toEqual(user.email);
    expect(res.roles).toEqual(user.roles);
    expect(res.name).toEqual(user.name);
    expect(res.surname).toEqual(user.surname);
  });
});
