import { CreateUserRequest } from './dtos/create-user.request.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../auth/role.enum';

describe('UserController', () => {
  let controller: UsersController;
  const createMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: createMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should create user', async () => {
    const createUserDto: CreateUserRequest = {
      username: 'carlos',
      password: 'changeme',
      roles: [Role.Admin],
    };
    const result = await controller.create(createUserDto);

    expect(result.username).toEqual('carlos');
    expect(result.roles).toEqual([Role.Admin]);
  });
});
