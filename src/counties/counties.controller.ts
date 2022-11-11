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
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { GetCountyUserResponse } from './dto/response/get-county-user-response.dto';
import { UpdateCountyUserRequest } from './dto/request/update-county-user-request.dto';

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
  async create(@Body() createCountyDto: CreateCountyDto) {
    try {
      return await this.countiesService.create(createCountyDto);
    } catch (err) {
      throw new BadRequestException('Can`t save counties now');
    }
  }

  @ApiOperation({ summary: 'Find all counties', description: 'forbidden' })
  @ApiResponse({ type: [GetCountyDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get()
  async findAll() {
    const counties = await this.countiesService.findAll();

    if (counties) return counties;

    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Find one county', description: 'forbidden' })
  @ApiResponse({ type: GetCountyDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
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
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCountyDto: UpdateCountyDto,
  ) {
    return this.countiesService.update(id, updateCountyDto);
  }

  @ApiOperation({ summary: 'Remove county', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.countiesService.remove(id);
  }

  @ApiOperation({ summary: 'Create county user', description: 'forbidden' })
  @ApiBody({ type: CreateCountyUserRequest })
  @ApiResponse({ type: GetCountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post(':id/users')
  async createCountyUser(
    @Param('id', ParseObjectIdPipe) countyId: string,
    @Body() createCountyUserRequest: CreateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    const countyUser = await this.countiesService.createCountyUser(
      countyId,
      createCountyUserRequest,
    );

    const response: GetCountyUserResponse = {
      _id: countyUser._id,
      email: countyUser.email,
      properties: countyUser.properties,
    };

    return response;
  }

  @ApiOperation({ summary: 'Find county user', description: 'forbidden' })
  @ApiBody({ type: CreateCountyUserRequest })
  @ApiResponse({ type: GetCountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get(':id/users')
  async findCountyUser(
    @Param('id', ParseObjectIdPipe) countyId: string,
  ): Promise<GetCountyUserResponse[]> {
    const countyUsers = await this.countiesService.findCountyUsers(countyId);

    const response = countyUsers.map((countyUser) => {
      return {
        _id: countyUser._id,
        email: countyUser.email,
        name: countyUser.name,
        surname: countyUser.surname,
        properties: countyUser.properties,
      } as GetCountyUserResponse;
    });

    return response;
  }

  @ApiOperation({ summary: 'Update county user', description: 'forbidden' })
  @ApiBody({ type: UpdateCountyUserRequest })
  @ApiResponse({ type: GetCountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Put(':id/users')
  async updateCountyUser(
    @Param('id', ParseObjectIdPipe) countyId: string,
    @Body() updateCountyUserRequest: UpdateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    const countyUser = await this.countiesService.updateCountyUser(
      updateCountyUserRequest,
    );

    const response: GetCountyUserResponse = {
      _id: countyUser._id,
      email: countyUser.email,
      name: countyUser.name,
      surname: countyUser.surname,
      properties: countyUser.properties,
    };

    return response;
  }
}
