import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { Unit } from './schemas/unit.schema';
import { CreateUnitRequest } from './dto/create-unit-request.dto';
import { UnitsRepository } from './units.repository';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(private readonly unitsRepository: UnitsRepository) {}

  async find() {
    return this.unitsRepository.find({});
  }

  async findOne(filterQuery: FilterQuery<Unit>) {
    return this.unitsRepository.findOne(filterQuery);
  }

  async create(createUnitRequest: CreateUnitRequest) {
    const session = await this.unitsRepository.startTransaction();
    try {
      const uniqueUnit = await this.unitsRepository.find({
        name: createUnitRequest.name,
      });

      if (uniqueUnit.length !== 0) {
        throw new ConflictException('Unit already exists');
      }

      const unit = await this.unitsRepository.create(createUnitRequest, {
        session,
      });

      await session.commitTransaction();

      return unit;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  remove(id: string) {
    this.logger.log(`county id: ${id} will be deleted...`);
    return this.unitsRepository.deleteOne({ _id: id });
  }
}
