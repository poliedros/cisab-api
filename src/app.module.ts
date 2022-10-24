import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CountiesModule } from './counties/counties.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    HealthModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    CountiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
