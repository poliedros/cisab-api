import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountiesService } from './counties.service';
import { GetCountyDto } from './dto/get-county.dto';
import { CreateCountyDto } from './dto/create-county.dto';
import { UpdateCountyDto } from './dto/update-county.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { RolesGuard } from './../guards/roles.guard';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';

@ApiTags('counties')
@Controller('counties')
export class CountiesController {
  constructor(private readonly countiesService: CountiesService) {}

  @ApiOperation({ summary: 'Create new county', description: 'forbidden' })
  @ApiBody({ type: CreateCountyDto })
  @ApiResponse({ type: GetCountyDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  create(@Body() createCountyDto: CreateCountyDto) {
    return this.countiesService.create(createCountyDto);
  }

  @ApiOperation({ summary: 'Find all counties', description: 'forbidden' })
  @ApiResponse({ type: GetCountyDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get()
  async findAll() {
    const counties = await this.countiesService.findAll();

    if (counties) return counties;

    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Find one county', description: 'forbidden' })
  @ApiResponse({ type: [GetCountyDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException({
        message: 'Id is not valid',
      });
    }

    const county = await this.countiesService.findOne(id);

    if (county) return county;

    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Update one county', description: 'forbidden' })
  @ApiBody({ type: UpdateCountyDto })
  @ApiResponse({ type: GetCountyDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCountyDto: UpdateCountyDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException({
        message: 'Id is not valid',
      });
    }

    return this.countiesService.update(id, updateCountyDto);
  }

  @ApiOperation({ summary: 'Remove county', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException({
        message: 'Id is not valid',
      });
    }

    return this.countiesService.remove(id);
  }
}
