import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';

@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Post()
  create(@Body() createDemandDto: CreateDemandDto) {
    return this.demandsService.create(createDemandDto);
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
  update(@Param('id') id: string, @Body() updateDemandDto: UpdateDemandDto) {
    return this.demandsService.update(+id, updateDemandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandsService.remove(+id);
  }
}
