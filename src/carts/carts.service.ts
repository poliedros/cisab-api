import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { CartsRepository } from './carts.repository';
import { CartsRequest } from './dto/request/carts-request.dto';
import { GetCartResponse } from './dto/response/get-cart-response.dto';

@Injectable()
export class CartsService {
  protected readonly logger = new Logger(CartsService.name);

  constructor(@Inject() private cacheRepository: CartsRepository) {}

  upsert(cart: CartsRequest, county_id: string): Promise<GetCartResponse> {
    throw new NotImplementedException();
  }

  get(county_id: string, demand_id: string): Promise<GetCartResponse> {
    throw new NotImplementedException();
  }

  close(county_id: string, demand_id: string) {
    throw new NotImplementedException();
  }
}
