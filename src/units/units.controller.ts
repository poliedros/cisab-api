import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUnitRequest } from './dto/create-unit-request.dto';
import { UnitsService } from './units.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { GetUnitResponse } from './dto/get-unit-response.dto';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  private readonly logger = new Logger(UnitsController.name);
  constructor(private readonly unitsService: UnitsService) {}

  @ApiOperation({ summary: 'Find all units', description: 'forbidden' })
  @ApiBody({ type: CreateUnitRequest })
  @ApiResponse({ type: GetUnitResponse })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.unitsService.find();
  }

  @ApiOperation({ summary: 'Create new unit', description: 'forbidden' })
  @ApiBody({ type: CreateUnitRequest })
  @ApiResponse({ type: GetUnitResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  async create(@Body() req: CreateUnitRequest) {
    return this.unitsService.create(req);
  }

  @ApiOperation({ summary: 'delete unit', description: 'forbidden' })
  @ApiBody({ type: CreateUnitRequest })
  @ApiResponse({ type: GetUnitResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.unitsService.remove(id);
  }
}
