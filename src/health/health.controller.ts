import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HealthCheck,
  MicroserviceHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private microserviceHealthCheck: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.microserviceHealthCheck.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: `${process.env.REDIS_AUTH_PASS}`,
          },
        }),
      () =>
        this.microserviceHealthCheck.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
          },
        }),
    ]);
  }
}
