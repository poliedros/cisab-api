import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAll() {
    return this.demandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDemandDto: UpdateDemandRequest,
  ) {
    return this.demandsService.update(+id, updateDemandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandsService.remove(+id);
  }
}
