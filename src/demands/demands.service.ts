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
      created_on: new Date(),
    };

    if (createDemandDto.draft) demand.state = DemandState.draft;

    return this.demandsRepository.create(demand);
  }

  findAll({
    name,
    start_date,
    end_date,
    states,
    page,
  }: {
    name: string;
    start_date: string;
    end_date: string;
    states: string[];
    page: number;
  }) {
    const filter: any = {};

    if (name) filter.name = name;
    if (start_date) filter.start_date = { $gte: start_date };
    if (end_date) filter.end_date = { $lte: end_date };
    if (states) filter.state = { $all: states };
    if (!page) page = 0;

    return this.demandsRepository.paginate(filter, page);
  }

  findOne(id: string) {
    return this.demandsRepository.findOne({ _id: id });
  }

  update(id: string, updateDemandDto: UpdateDemandRequest) {
    return this.demandsRepository.upsert({ _id: id }, updateDemandDto);
  }

  remove(id: string) {
    return this.demandsRepository.deleteOne({ _id: id });
  }
}
