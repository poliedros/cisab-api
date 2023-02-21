import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartsMongoRepository extends AbstractRepository<Cart> {
  protected readonly logger = new Logger(CartsMongoRepository.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectConnection() connection: Connection,
  ) {
    super(cartModel, connection);
  }

  async close(cart: Cart) {
    try {
      cart.state = 'closed';
      const doc = new this.cartModel(cart);
      return (await doc.save()).toJSON();
    } catch (err) {
      throw err;
    }
  }
}
