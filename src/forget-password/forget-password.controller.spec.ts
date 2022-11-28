import { Test, TestingModule } from '@nestjs/testing';
import { ForgetPasswordController } from './forget-password.controller';
import { ForgetPasswordService } from './forget-password.service';

describe('ForgetPasswordController', () => {
  let controller: ForgetPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgetPasswordController],
      providers: [
        {
          provide: ForgetPasswordService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ForgetPasswordController>(ForgetPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
