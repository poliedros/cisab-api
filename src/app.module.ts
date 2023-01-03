import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { CountiesModule } from './counties/counties.module';
import { NotifierModule } from './notifier/notifier.module';
import { UnitsModule } from './units/units.module';
import { ProductsModule } from './products/products.module';
import { ForgetPasswordModule } from './forget-password/forget-password.module';
import { CategoriesModule } from './categories/categories.module';
import { DemandsModule } from './demands/demands.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    HealthModule,
    CountiesModule,
    NotifierModule,
    UnitsModule,
    ProductsModule,
    ForgetPasswordModule,
    CategoriesModule,
    DemandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
