import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { CartDto } from './dto/cart.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class CartsCacheRepository {
  FIVE_DAYS = 432000;

  protected readonly logger = new Logger(CartsCacheRepository.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async upsert(cart: CartDto): Promise<CartDto> {
    const key = `${cart.county_id}, ${cart.demand_id}`;
    await this.cacheManager.set(key, cart, {
      ttl: this.FIVE_DAYS,
    });
    return cart;
  }

  async get(county_id: string, demand_id: string): Promise<CartDto> {
    const key = `${county_id}, ${demand_id}`;
    return this.cacheManager.get(key);
  }
}
