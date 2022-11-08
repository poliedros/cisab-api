import { GetUnitResponse } from './dto/get-unit-response.dto';
import {
  BadRequestException,
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
import { JwtAuthGuard } from './../../src/auth/jwt-auth.guard';
import { RolesGuard } from './../guards/roles.guard';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';

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
  @Roles(Role.County, Role.Admin)
  @Post()
  async create(@Body() req: CreateUnitRequest) {
    return this.unitsService.create(req);
  }

  @ApiOperation({ summary: 'Create new unit', description: 'forbidden' })
  @ApiBody({ type: CreateUnitRequest })
  @ApiResponse({ type: GetUnitResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.County)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException({
        message: 'Id is not valid',
      });
    }
    return this.unitsService.remove(id);
  }
}
