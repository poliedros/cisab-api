import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from './../database/abstract.repository';
import { County } from './schemas/county.schema';

@Injectable()
export class CountiesRepository extends AbstractRepository<County> {
  protected readonly logger = new Logger(CountiesRepository.name);

  constructor(
    @InjectModel(County.name) countyModel: Model<County>,
    @InjectConnection() connection: Connection,
  ) {
    super(countyModel, connection);
  }
}
