import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const loginMockFn = jest.fn();
  const profileMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: loginMockFn,
            profile: profileMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login', async () => {
    const loginResult = { access_token: '323' };

    loginMockFn.mockReturnValue(Promise.resolve(loginResult));

    const req: any = { user: { email: 'carlos', pasword: '3' } };

    const login = await controller.login(req);

    expect(login).toEqual(loginResult);
  });

  it('should get profile', async () => {
    profileMockFn.mockReturnValue(Promise.resolve({ email: 'carlos' }));

    const profile = await controller.getProfile({
      user: { email: 'carlos' },
    });

    expect(profile).toEqual({ email: 'carlos' });
  });
});
