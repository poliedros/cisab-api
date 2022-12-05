import { Test, TestingModule } from '@nestjs/testing';
import { ForgetPasswordController } from './forget-password.controller';
import { ForgetPasswordService } from './forget-password.service';

describe('ForgetPasswordController', () => {
  let controller: ForgetPasswordController;
  const runMockFn = jest.fn();
  const updatePasswordMockFn = jest.fn();
  const validateMockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgetPasswordController],
      providers: [
        {
          provide: ForgetPasswordService,
          useValue: {
            run: runMockFn,
            updatePassword: updatePasswordMockFn,
            validate: validateMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<ForgetPasswordController>(ForgetPasswordController);
  });

  it('should run forget password use case', async () => {
    runMockFn.mockReturnValue(Promise.resolve());

    await controller.forgetPassword({ email: 'contact@czar.dev' });

    expect(true).toBeTruthy();
  });

  it('should throw exception in forget password use case', async () => {
    class TestError extends Error {}
    runMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await controller.forgetPassword({ email: 'contact@czar.dev' });
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should recovery password', async () => {
    updatePasswordMockFn.mockReturnValue(Promise.resolve());

    await controller.recovery('1234', { password: 'newpassword' });

    expect(true).toBeTruthy();
  });

  it('should throw excetion in recovery password', async () => {
    class TestError extends Error {}

    updatePasswordMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await controller.recovery('1234', { password: 'newpassword' });
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });

  it('should validate forget password', async () => {
    updatePasswordMockFn.mockReturnValue(Promise.resolve());

    await controller.validate('1a');

    expect(true).toBeTruthy();
  });

  it('should throw excetion in validating forget password', async () => {
    class TestError extends Error {}

    validateMockFn.mockImplementation(() => {
      throw new TestError();
    });

    try {
      await controller.validate(`1a`);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(TestError);
    }
  });
});
