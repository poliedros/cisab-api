import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { ExampleModule } from './example/example.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    HealthModule,
    ExampleModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
