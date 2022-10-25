import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import { Model } from 'mongoose';
import { CreateCountyDto } from './dto/create-county.dto';
import { UpdateCountyDto } from './dto/update-county.dto';
import { County, CountyDocument } from './schemas/county.schema';

@Injectable()
export class CountiesService {
  constructor(
    @InjectModel(County.name)
    private readonly countyModel: Model<CountyDocument>,
  ) {}

  create(createCountyDto: CreateCountyDto) {
    const county = new this.countyModel(createCountyDto);
    return county.save();
  }

  findAll() {
    return this.countyModel.find().exec();
  }

  findOne(id: string) {
    try {
      return this.countyModel.findOne({ _id: id }).exec();
    } catch (e: any) {
      throw e;
    }
  }

  update(id: string, updateCountyDto: UpdateCountyDto) {
    return this.countyModel.updateOne({ _id: id }, updateCountyDto).exec();
  }

  remove(id: string) {
    return this.countyModel.deleteOne({ _id: id }).exec();
  }
}
