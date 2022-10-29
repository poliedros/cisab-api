import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CountiesRepository } from './counties.repository';
import { CreateCountyDto } from './dto/create-county.dto';
import { UpdateCountyDto } from './dto/update-county.dto';
import { NotifierService } from './../notifier/notifier.service';

@Injectable()
export class CountiesService {
  constructor(
    private readonly countyRepository: CountiesRepository,
    private readonly notifierService: NotifierService,
  ) {}

  async create(createCountyDto: CreateCountyDto) {
    const session = await this.countyRepository.startTransaction();
    try {
      const county = await this.countyRepository.create(createCountyDto, {
        session,
      });

      await lastValueFrom(
        this.notifierService.emit({
          type: 'email',
          message: { body: 'message' },
        }),
      );

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
