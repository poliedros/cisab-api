import { CacheModule, CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartsController } from './carts.controller';
import type { ClientOpts } from 'redis';
import { CartsService } from './carts.service';
import * as redisStore from 'cache-manager-redis-store';
import { CartsCacheRepository } from './carts.cache.repository';
import { ProductsModule } from '../products/products.module';
import { DemandsModule } from '../demands/demands.module';
import { UsersModule } from '../users/users.module';
import { CartsMongoRepository } from './carts.mongo.repository';
import { CountiesModule } from '../counties/counties.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_AUTH_PASS,
    }),
    ProductsModule,
    DemandsModule,
    UsersModule,
    CountiesModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsCacheRepository, CartsMongoRepository],
})
export class CartsModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  onModuleDestroy() {
    const redisClient = this.cacheManager.store.getClient();
    redisClient.quit();
  }
}
