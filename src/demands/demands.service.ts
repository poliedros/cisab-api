import { Injectable } from '@nestjs/common';
import { DemandsRepository } from './demands.repository';
import {
  CreateDemandRequest,
  CreateDemandStateEnum,
} from './dto/request/create-demand-request.dto';
import { UpdateDemandRequest } from './dto/request/update-demand-request.dto';
import { DemandState } from './enums/demand-state.enum';
import { Demand } from './schemas/demand.schema';

@Injectable()
export class DemandsService {
  constructor(private readonly demandsRepository: DemandsRepository) {}

  async create(createDemandDto: CreateDemandRequest) {
    const demand: Demand = {
      _id: undefined,
      name: createDemandDto.name,
      start_date: createDemandDto.start_date,
      end_date: createDemandDto.end_date,
      product_ids: createDemandDto.product_ids,
      state: null,
    };

    if (createDemandDto.state == CreateDemandStateEnum.draft)
      demand.state = DemandState.draft;

    return this.demandsRepository.create(demand);
  }

  findAll() {
    return `This action returns all demands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demand`;
  }

  update(id: number, updateDemandDto: UpdateDemandRequest) {
    return `This action updates a #${id} demand`;
  }

  remove(id: number) {
    return `This action removes a #${id} demand`;
  }
}
