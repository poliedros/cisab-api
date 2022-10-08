import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';

describe('Local Strategy', () => {
  let localStrategy: LocalStrategy;
  const validateUserMockFn = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: validateUserMockFn,
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should validate username, password', async () => {
    const userValidation = { id: '3', username: 'carlos' };
    validateUserMockFn.mockReturnValue(Promise.resolve(userValidation));

    const response = await localStrategy.validate('carlos', 'changeme');

    expect(response).toEqual({ id: '3', username: 'carlos' });
  });

  it('should throw unauthorized exception', async () => {
    try {
      await localStrategy.validate('carlos', 'changeme');
    } catch (e: any) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
