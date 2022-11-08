import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { Unit } from './schemas/unit.schema';

@Injectable()
export class UnitsRepository extends AbstractRepository<Unit> {
  protected readonly logger = new Logger(UnitsRepository.name);

  constructor(
    @InjectModel(Unit.name) unitModel: Model<Unit>,
    @InjectConnection() connection: Connection,
  ) {
    super(unitModel, connection);
  }
}
