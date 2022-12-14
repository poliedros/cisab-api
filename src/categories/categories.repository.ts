import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoriesRepository.name);

  constructor(
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectConnection() connection: Connection,
  ) {
    super(categoryModel, connection);
  }
}
