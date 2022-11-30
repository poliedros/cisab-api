import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotifierService } from '../notifier/notifier.service';
import { UsersService } from '../users/users.service';
import { ForgetPasswordRepository } from './forget-password.repository';
import { ForgetPasswordService } from './forget-password.service';

describe('ForgetPasswordService', () => {
  let service: ForgetPasswordService;
  const startTransactionMockFn = jest.fn();

  const findOneMockFn = jest.fn();
  const createMockFn = jest.fn();
  const emitMockFn = jest.fn();
  const findOneForgetPasswordMockFn = jest.fn();
  const updateMockFn = jest.fn();
  const upsertMockFn = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();
    startTransactionMockFn.mockReturnValue(
      Promise.resolve({
        abortTransaction: jest.fn(),
        commitTransaction: jest.fn(),
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgetPasswordService,
        {
          provide: UsersService,
          useValue: {
            findOne: findOneMockFn,
            update: updateMockFn,
          },
        },
        {
          provide: NotifierService,
          useValue: {
            emit: emitMockFn,
          },
        },
        {
          provide: ForgetPasswordRepository,
          useValue: {
            startTransaction: startTransactionMockFn,
            create: createMockFn,
            findOne: findOneForgetPasswordMockFn,
            upsert: upsertMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<ForgetPasswordService>(ForgetPasswordService);
  });

  it('should run forget password use case', async () => {
    findOneMockFn.mockReturnValue(
      Promise.resolve({ _id: '12', email: 'contact@czar.dev' }),
    );

    createMockFn.mockReturnValue(Promise.resolve({ _id: 'a1b2' }));

    await service.run('contact@czar.dev');

    expect(emitMockFn).toBeCalledTimes(1);
  });

  it('should throw exception in forget password', async () => {
    class TestError extends Error {}

    findOneMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await service.run('contact@czar.dev');
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should throw exception if forget password id was already used', async () => {
    findOneForgetPasswordMockFn.mockReturnValue(
      Promise.resolve({ _id: '1a', userId: '5a', oldPassword: '1a' }),
    );

    try {
      await service.updatePassword('1a', 'newpassword');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should throw exception if user is not found', async () => {
    findOneForgetPasswordMockFn.mockReturnValue(
      Promise.resolve({ _id: '1a', userId: 'b1' }),
    );

    findOneForgetPasswordMockFn.mockReturnValue(Promise.resolve());

    try {
      await service.run('1a');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update password', async () => {
    findOneForgetPasswordMockFn.mockReturnValue(
      Promise.resolve({ _id: '1a', userId: 'b1' }),
    );

    findOneMockFn.mockReturnValue(
      Promise.resolve({ password: 'password', email: 'contact@czar.dev' }),
    );

    updateMockFn.mockReturnValue(Promise.resolve({ password: '123' }));

    upsertMockFn.mockReturnValue(Promise.resolve());

    await service.updatePassword('1a', 'newpassword');

    expect(emitMockFn).toBeCalledTimes(1);
  });

  it('should throw not found exception if forget password id is not found', async () => {
    findOneForgetPasswordMockFn.mockReturnValue(Promise.resolve());

    try {
      await service.updatePassword('1a', 'newpassword');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw not found exception if user is not found', async () => {
    findOneForgetPasswordMockFn.mockReturnValue(
      Promise.resolve({ _id: '1a', userId: 'b1' }),
    );

    findOneMockFn.mockReturnValue(Promise.resolve());

    try {
      await service.updatePassword('1a', 'newpassword');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw exception in update password', async () => {
    class TestError extends Error {}

    findOneForgetPasswordMockFn.mockReturnValue(
      Promise.resolve({ _id: '1a', userId: 'b1' }),
    );

    findOneMockFn.mockReturnValue(
      Promise.resolve({ password: 'password', email: 'contact@czar.dev' }),
    );

    updateMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await service.updatePassword('1a', 'newpassword');
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });
});
