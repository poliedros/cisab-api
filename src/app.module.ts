import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [AuthModule, UsersModule, HealthModule, ExampleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
