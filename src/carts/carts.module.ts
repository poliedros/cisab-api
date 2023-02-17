import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartsController } from './carts.controller';
import type { RedisClientOptions } from 'redis';
import { CartsService } from './carts.service';
import * as redisStore from 'cache-manager-redis-store';
import { CartsRepository } from './carts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_AUTH_PASS,
    }),
  ],
  controllers: [CartsController],
  providers: [CartsRepository, CartsService],
})
export class CartsModule {}
