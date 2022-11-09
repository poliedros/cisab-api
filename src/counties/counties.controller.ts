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
import { GetCountyDto } from './dto/response/get-county.dto';
import { CreateCountyDto } from './dto/request/create-county.dto';
import { UpdateCountyDto } from './dto/request/update-county.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CountyUserResponse } from './dto/response/county-user-response.dto';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { CreateUserRequest } from 'src/users/dtos/create-user.request.dto';

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

  @ApiOperation({ summary: 'Create county user', description: 'forbidden' })
  @ApiBody({ type: CreateCountyUserRequest })
  @ApiResponse({ type: CountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post(':id/users')
  async createCountyUser(
    @Param('id') countyId: string,
    @Body() createCountyUserRequest: CreateCountyUserRequest,
  ): Promise<CountyUserResponse> {
    const countyUser = await this.countiesService.createCountyUser(
      countyId,
      createCountyUserRequest,
    );

    const response: CountyUserResponse = {
      _id: countyUser._id,
      username: countyUser.username,
      properties: countyUser.properties,
    };

    return response;
  }
}
