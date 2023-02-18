import { CacheModule, CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartsController } from './carts.controller';
import type { ClientOpts } from 'redis';
import { CartsService } from './carts.service';
import * as redisStore from 'cache-manager-redis-store';
import { CartsRepository } from './carts.repository';
import { ProductsModule } from '../products/products.module';
import { DemandsModule } from '../demands/demands.module';
import { UsersModule } from '../users/users.module';

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
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository],
})
export class CartsModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  onModuleDestroy() {
    const redisClient = this.cacheManager.store.getClient();
    redisClient.quit();
  }
}
