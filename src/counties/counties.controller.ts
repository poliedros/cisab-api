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
  Request,
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
import { CreateEmployeeRequest } from './dto/request/create-employee-request.dto';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { GetEmployeeResponse } from './dto/response/get-employee-response.dto';
import { UpdateEmployeeRequest } from './dto/request/update-employee-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { CreateManagerResponse } from './dto/response/create-manager-response.dto';
import { Types } from 'mongoose';
import { UpdateManagerPasswordRequest } from './dto/request/update-manager-password-request.dto';
import { Payload } from 'src/auth/auth.service';

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
  @Roles(Role.Cisab, Role.Manager, Role.Employee)
  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId | string,
    @Request() req,
  ) {
    const userPayload = req.user as Payload;

    let userCountyId: string;
    if (
      userPayload.roles.includes(Role.Cisab) ||
      userPayload.roles.includes(Role.Admin)
    ) {
      userCountyId = id.toString();
    } else userCountyId = userPayload.county_id;

    const county = await this.countiesService.findOne(userCountyId);

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

  @ApiOperation({ summary: 'Create employee', description: 'forbidden' })
  @ApiBody({ type: CreateEmployeeRequest })
  @ApiResponse({ type: GetEmployeeResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab, Role.Manager)
  @Post(':id/users')
  async createEmployee(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Body() createEmployeeRequest: CreateEmployeeRequest,
  ): Promise<GetEmployeeResponse> {
    const employee = await this.countiesService.createEmployee(
      countyId.toString(),
      createEmployeeRequest,
    );

    const response: GetEmployeeResponse = {
      _id: employee._id,
      email: employee.email,
      properties: employee.properties,
    };

    return response;
  }

  @ApiOperation({ summary: 'Find employee', description: 'forbidden' })
  @ApiBody({ type: CreateEmployeeRequest })
  @ApiResponse({ type: GetEmployeeResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab, Role.Manager, Role.Employee)
  @Get(':id/users')
  async findEmployee(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Request() req,
  ): Promise<GetEmployeeResponse[]> {
    const userPayload = req.user as Payload;

    let userCountyId: string;
    if (
      userPayload.roles.includes(Role.Cisab) ||
      userPayload.roles.includes(Role.Admin)
    ) {
      userCountyId = countyId.toString();
    } else userCountyId = userPayload.county_id;

    const employees = await this.countiesService.findEmployees(userCountyId);

    const response = employees.map((employee) => {
      return {
        _id: employee._id,
        email: employee.email,
        name: employee.name,
        surname: employee.surname,
        properties: employee.properties,
      } as GetEmployeeResponse;
    });

    return response;
  }

  @ApiOperation({ summary: 'Update employee', description: 'forbidden' })
  @ApiBody({ type: UpdateEmployeeRequest })
  @ApiResponse({ type: GetEmployeeResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab, Role.Employee)
  @Put(':id/users')
  async updateEmployee(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Body() updateEmployeeRequest: UpdateEmployeeRequest,
  ): Promise<GetEmployeeResponse> {
    const employee = await this.countiesService.updateEmployee(
      countyId.toString(),
      updateEmployeeRequest,
    );

    const response: GetEmployeeResponse = {
      _id: employee._id,
      email: employee.email,
      name: employee.name,
      surname: employee.surname,
      properties: employee.properties,
    };

    return response;
  }

  @ApiOperation({ summary: 'Remove employee', description: 'forbidden' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab, Role.Manager)
  @Delete(':county_id/users/:id')
  removeEmployee(@Param('id', ParseObjectIdPipe) id: Types.ObjectId | string) {
    return this.countiesService.removeEmployee(id.toString());
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
  @ApiBody({ type: CreateEmployeeRequest })
  @ApiResponse({ type: GetEmployeeResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Cisab, Role.Manager)
  @Get(':id/autarkies')
  async getAutarkies(
    @Param('id', ParseObjectIdPipe) countyId: Types.ObjectId | string,
    @Request() req,
  ) {
    const userPayload = req.user as Payload;

    if (
      userPayload.roles.includes(Role.Cisab) ||
      userPayload.roles.includes(Role.Admin)
    ) {
      return this.countiesService.findAll({
        county_id: countyId.toString(),
      });
    }

    return this.countiesService.findAll({
      county_id: countyId.toString(),
      _id: userPayload.county_id,
    });
  }
}
