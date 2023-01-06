import { Injectable } from '@nestjs/common';
import { DemandsRepository } from './demands.repository';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
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

    if (createDemandDto.draft) demand.state = DemandState.draft;

    return this.demandsRepository.create(demand);
  }

  findAll({
    name,
    start_date,
    end_date,
    states,
  }: {
    name: string;
    start_date: string;
    end_date: string;
    states: string[];
  }) {
    const filter: any = {};

    if (name) filter.name = name;
    if (start_date) filter.start_date = { $gte: start_date };
    if (end_date) filter.end_date = { $lte: end_date };
    if (states) filter.state = { $all: states };

    return this.demandsRepository.find(filter);
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
