import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { UpdateDemandRequest } from './dto/request/update-demand-request.dto';

@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Post()
  create(@Body() createDemandDto: CreateDemandRequest) {
    try {
      return this.demandsService.create(createDemandDto);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  findAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('name') name: string,
    @Query('state') states: string[],
    @Query('page') page: string,
  ) {
    return this.demandsService.findAll({
      start_date,
      end_date,
      name,
      states,
      page: +page,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDemandDto: UpdateDemandRequest,
  ) {
    const updateRequest: UpdateDemandRequest = {
      name: updateDemandDto.name,
      start_date: updateDemandDto.start_date,
      end_date: updateDemandDto.end_date,
      product_ids: updateDemandDto.product_ids,
    };

    return this.demandsService.update(id, updateRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandsService.remove(id);
  }
}
