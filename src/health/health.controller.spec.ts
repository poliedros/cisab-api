import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckResult,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  const healthCheckMock = jest.fn();
  const pingCheckMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: healthCheckMock,
          },
        },
        {
          provide: MicroserviceHealthIndicator,
          useValue: {
            pingCheck: pingCheckMock,
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('make some tests later', async () => {
    const healthResult: HealthCheckResult = {
      status: 'ok',
      info: {
        redis: {
          status: 'up',
        },
      },
      error: {},
      details: {
        redis: {
          status: 'up',
        },
      },
    };
    healthCheckMock.mockReturnValue(Promise.resolve(healthResult));

    const checkResult = await controller.check();

    expect(checkResult).toEqual(healthResult);
  });
});
