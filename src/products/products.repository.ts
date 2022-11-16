import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectModel(Product.name) userModel: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
