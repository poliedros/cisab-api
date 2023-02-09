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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountiesService } from './counties.service';
import { GetCountyResponse } from './dto/response/get-county-response.dto';
import { CreateCountyRequest } from './dto/request/create-county-request.dto';
import { UpdateCountyRequest } from './dto/request/update-county-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { GetCountyUserResponse } from './dto/response/get-county-user-response.dto';
import { UpdateCountyUserRequest } from './dto/request/update-county-user-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { CreateManagerResponse } from './dto/response/create-manager-response.dto';
import { Types } from 'mongoose';
import { UpdateManagerPasswordRequest } from './dto/request/update-manager-password-request.dto';

@ApiTags('counties')
@Controller('counties')
export class CountiesController {
  constructor(private readonly countiesService: CountiesService) {}

  @ApiOperation({ summary: 'Create new county', description: 'forbidden' })
  @ApiBody({ type: CreateCountyRequest })
  @ApiResponse({ type: GetCountyResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post()
  async create(@Body() createCountyDto: CreateCountyRequest) {
    try {
      return await this.countiesService.create(createCountyDto);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Find all counties', description: 'forbidden' })
  @ApiResponse({ type: [GetCountyResponse] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get()
  async findAll() {
    const counties = await this.countiesService.findAll({});

    if (counties) return counties;

    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Find one county', description: 'forbidden' })
  @ApiResponse({ type: GetCountyResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId | string) {
    const county = await this.countiesService.findOne(id.toString());

    if (county) return county;

    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Update one county', description: 'forbidden' })
  @ApiBody({ type: UpdateCountyRequest })
  @ApiResponse({ type: GetCountyResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId | string,
    @Body() updateCountyDto: UpdateCountyRequest,
  ) {
    return this.countiesService.update(id.toString(), updateCountyDto);
  }

  @ApiOperation({ summary: 'Remove county', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId | string) {
    try {
      return this.countiesService.remove(id.toString());
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Create county user', description: 'forbidden' })
  @ApiBody({ type: CreateCountyUserRequest })
  @ApiResponse({ type: GetCountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post(':id/users')
  async createCountyUser(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Body() createCountyUserRequest: CreateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    const countyUser = await this.countiesService.createCountyUser(
      countyId.toString(),
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
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
  ): Promise<GetCountyUserResponse[]> {
    const countyUsers = await this.countiesService.findCountyUsers(
      countyId.toString(),
    );

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
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Body() updateCountyUserRequest: UpdateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    const countyUser = await this.countiesService.updateCountyUser(
      countyId.toString(),
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

  @ApiOperation({ summary: 'Remove county user', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Delete(':county_id/users/:id')
  removeCountyUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId | string,
  ) {
    return this.countiesService.removeCountyUser(id.toString());
  }

  @ApiOperation({ summary: 'Create manager', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Post('/manager')
  async createManager(
    @Body() createManagerRequest: CreateManagerRequest,
  ): Promise<CreateManagerResponse> {
    try {
      const county = await this.countiesService.createManager(
        createManagerRequest,
      );

      return {
        county_id: county._id,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Confirm manager creation',
    description: 'forbidden',
  })
  @Post('/manager/:id/confirm')
  async confirmManager(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    let active = false;
    try {
      active = await this.countiesService.isManagerActive(id);
    } catch (err) {
      throw new BadRequestException();
    }

    if (active) return true;

    return false;
  }

  @ApiOperation({
    summary: 'Update manager password',
    description: 'forbidden',
  })
  @Post('/manager/:id')
  async updateManagerPassword(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() request: UpdateManagerPasswordRequest,
  ) {
    if (await this.countiesService.isManagerActive(id)) {
      throw new UnauthorizedException();
    }

    const res = await this.countiesService.updateManagerPassword(
      id,
      request.password,
    );

    return res;
  }

  @ApiOperation({ summary: 'Get county autarkies', description: 'forbidden' })
  @ApiBody({ type: CreateCountyUserRequest })
  @ApiResponse({ type: GetCountyUserResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab)
  @Get(':id/autarkies')
  async getAutarkies(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
  ) {
    const counties = this.countiesService.findAll({
      county_id: countyId.toString(),
    });

    return counties;
  }
}
