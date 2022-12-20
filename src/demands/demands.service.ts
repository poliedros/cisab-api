import { Injectable } from '@nestjs/common';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';

@Injectable()
export class DemandsService {
  create(createDemandDto: CreateDemandDto) {
    return 'This action adds a new demand';
  }

  findAll() {
    return `This action returns all demands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demand`;
  }

  update(id: number, updateDemandDto: UpdateDemandDto) {
    return `This action updates a #${id} demand`;
  }

  remove(id: number) {
    return `This action removes a #${id} demand`;
  }
}
