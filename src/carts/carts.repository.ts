import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CartDto } from './dto/cart.dto';
import { Cart } from './schemas/cart.schema';
import { Cache } from 'cache-manager';

@Injectable()
export class CartsRepository {
  FIVE_DAYS = 432000;

  protected readonly logger = new Logger(CartsRepository.name);

  constructor(
    @InjectModel(Cart.name) private readonly userModel: Model<Cart>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

  async close(county_id: string, demand_id: string) {
    try {
      const key = `${county_id}, ${demand_id}`;
      const cart = (await this.cacheManager.get(key)) as CartDto;
      cart.state = 'close';
      const doc = new this.userModel(cart);
      return (await doc.save()).toJSON();
    } catch (err) {
      throw err;
    }
  }
}
