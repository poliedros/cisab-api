import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { Demand } from './schemas/demand.schema';

@Injectable()
export class DemandsRepository extends AbstractRepository<Demand> {
  protected readonly logger = new Logger(DemandsRepository.name);

  constructor(
    @InjectModel(Demand.name) categoryModel: Model<Demand>,
    @InjectConnection() connection: Connection,
  ) {
    super(categoryModel, connection);
  }

  paginate(filterQuery: FilterQuery<Demand>, page: number) {
    return this.model
      .find(
        filterQuery,
        {},
        {
          lean: true,
        },
      )
      .sort('created-on')
      .skip(page * 100)
      .limit(100);
  }
}
