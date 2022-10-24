import { GetCountyDto } from './dto/get-county.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountiesService } from './counties.service';
import { CreateCountyDto } from './dto/create-county.dto';
import { UpdateCountyDto } from './dto/update-county.dto';

@ApiTags('counties')
@Controller('counties')
export class CountiesController {
  constructor(private readonly countiesService: CountiesService) {}

  @ApiOperation({ summary: 'Create new county', description: 'forbidden' })
  @ApiBody({ type: CreateCountyDto })
  @ApiResponse({ type: GetCountyDto })
  @Post()
  create(@Body() createCountyDto: CreateCountyDto) {
    return this.countiesService.create(createCountyDto);
  }

  @ApiOperation({ summary: 'Find all counties', description: 'forbidden' })
  @ApiResponse({ type: GetCountyDto })
  @Get()
  findAll() {
    return this.countiesService.findAll();
  }

  @ApiOperation({ summary: 'Find one county', description: 'forbidden' })
  @ApiResponse({ type: [GetCountyDto] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countiesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one county', description: 'forbidden' })
  @ApiBody({ type: UpdateCountyDto })
  @ApiResponse({ type: GetCountyDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountyDto: UpdateCountyDto) {
    return this.countiesService.update(+id, updateCountyDto);
  }

  @ApiOperation({ summary: 'Remove county', description: 'forbidden' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countiesService.remove(+id);
  }
}
