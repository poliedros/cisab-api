import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DemandsService } from './demands.service';
import { CreateDemandRequest } from './dto/request/create-demand-request.dto';
import { UpdateDemandRequest } from './dto/request/update-demand-request.dto';
import { GetDemandResponse } from './dto/response/get-demand-response.dto';

@ApiTags('demands')
@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @ApiOperation({ summary: 'Create new demand', description: 'forbidden' })
  @ApiBody({ type: CreateDemandRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  create(@Body() createDemandDto: CreateDemandRequest) {
    try {
      return this.demandsService.create(createDemandDto);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get all demands', description: 'forbidden' })
  @Get()
  async findAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('name') name: string,
    @Query('state') states: string[],
    @Query('page') page: string,
  ): Promise<GetDemandResponse[]> {
    return this.demandsService.findAllWithProducts({
      start_date,
      end_date,
      name,
      states,
      page: +page,
    });
  }

  @ApiOperation({ summary: 'Get one demand', description: 'forbidden' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update demand', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
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

  @ApiOperation({ summary: 'Delete demand', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandsService.remove(id);
  }
}
