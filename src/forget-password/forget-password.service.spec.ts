import { Test, TestingModule } from '@nestjs/testing';
import { NotifierService } from '../notifier/notifier.service';
import { UsersService } from '../users/users.service';
import { ForgetPasswordRepository } from './forget-password.repository';
import { ForgetPasswordService } from './forget-password.service';

describe('ForgetPasswordService', () => {
  let service: ForgetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgetPasswordService,
        { provide: ForgetPasswordRepository, useValue: {} },
        { provide: NotifierService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<ForgetPasswordService>(ForgetPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
