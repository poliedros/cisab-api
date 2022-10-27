import { Injectable } from '@nestjs/common';
import { CountiesRepository } from './counties.repository';
import { CreateCountyDto } from './dto/create-county.dto';
import { UpdateCountyDto } from './dto/update-county.dto';

@Injectable()
export class CountiesService {
  constructor(private readonly countyRepository: CountiesRepository) {}

  async create(createCountyDto: CreateCountyDto) {
    const session = await this.countyRepository.startTransaction();
    try {
      const county = await this.countyRepository.create(createCountyDto, {
        session,
      });
      await session.commitTransaction();

      return county;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  findAll() {
    return this.countyRepository.find({});
  }

  findOne(id: string) {
    try {
      return this.countyRepository.findOne({ _id: id });
    } catch (e: any) {
      throw e;
    }
  }

  update(id: string, updateCountyDto: UpdateCountyDto) {
    return this.countyRepository.findOneAndUpdate({ _id: id }, updateCountyDto);
  }

  remove(id: string) {
    return this.countyRepository.deleteOne({ _id: id });
  }
}
