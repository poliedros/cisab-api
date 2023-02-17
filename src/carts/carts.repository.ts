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

@Injectable()
export class CartsRepository {
  protected readonly logger = new Logger(CartsRepository.name);

  constructor(
    @InjectModel(Cart.name) private readonly userModel: Model<Cart>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  upsert(cart: CartDto): Promise<CartDto> {
    console.log(cart);
    // (county_id, demand_id) => GetCartResponse
    throw new NotImplementedException();
  }

  get(county_id: string, demand_id: string): Promise<CartDto> {
    throw new NotImplementedException();
  }

  close(county_id: string, demand_id: string) {
    throw new NotImplementedException();
  }
}
