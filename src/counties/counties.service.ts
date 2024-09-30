import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CountiesRepository } from './counties.repository';
import { CreateCountyRequest } from './dto/request/create-county-request.dto';
import { UpdateCountyRequest } from './dto/request/update-county-request.dto';
import { NotifierService } from './../notifier/notifier.service';
import { CreateUserRequest } from 'src/users/dtos/create-user-request.dto';
import { CreateEmployeeRequest } from './dto/request/create-employee-request.dto';
import { Role } from '../auth/role.enum';
import { GetEmployeeResponse } from './dto/response/get-employee-response.dto';
import { UsersService } from '../users/users.service';
import { UpdateEmployeeRequest } from './dto/request/update-employee-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { FilterQuery, Types } from 'mongoose';
import { CountyEntity } from './entities/county.entity';
import { County } from './schemas/county.schema';

@Injectable()
export class CountiesService {
  private readonly logger = new Logger(CountiesService.name);

  constructor(
    private readonly countyRepository: CountiesRepository,
    private readonly notifierService: NotifierService,
    private readonly usersService: UsersService,
  ) {}

  async create(createCountyDto: CreateCountyRequest) {
    const session = await this.countyRepository.startTransaction();
    try {
      // check county already exists
      const countyExist = await this.countyRepository.findOneOrReturnUndefined({
        name: createCountyDto.name,
      });

      if (countyExist) {
        this.logger.error(
          `tried to save county with name ${createCountyDto.name}`,
        );
        throw new ConflictException();
      }

      const county = await this.countyRepository.create(createCountyDto, {
        session,
      });

      await lastValueFrom(
        this.notifierService.emit({
          type: 'county_created',
          message: { body: `county created id ${county._id}` },
        }),
      );
      this.logger.log(`county_created notifier event emitted!`);

      await session.commitTransaction();
      this.logger.log(`county id ${county._id} saved`);

      return county;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  findAll(filterQuery: FilterQuery<County>) {
    return this.countyRepository.find(filterQuery);
  }

  findOne(id: string) {
    try {
      return this.countyRepository.findOne({ _id: id });
    } catch (e: any) {
      throw e;
    }
  }

  async update(id: string, updateCountyRequest: UpdateCountyRequest) {
    this.logger.log(`county id: ${id} will be updated...`);
    const { name, contact, county_id, info } =
      await this.countyRepository.findOne({ _id: id });

    const county = new CountyEntity(name, info, contact, county_id);

    if (updateCountyRequest.contact) {
      county.contact = updateCountyRequest.contact;
    }

    if (updateCountyRequest.info) {
      county.info = updateCountyRequest.info;
    }

    // TODO: session here
    return this.countyRepository.findOneAndUpdate({ _id: id }, county);
  }

  async remove(id: string) {
    this.logger.log(`county id: ${id} will be deleted...`);
    const session = await this.countyRepository.startTransaction();
    try {
      const users = await this.usersService.find({
        'properties.county_id': id,
      });
      const usersIds = users.map((user) => user._id.toString());

      await this.usersService.removeMany(usersIds);

      await this.countyRepository.deleteOne({ _id: id });
      this.logger.log(`county id: ${id} has been deleted...`);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async createEmployee(
    countyId: string,
    createEmployeeRequest: CreateEmployeeRequest,
  ): Promise<GetEmployeeResponse> {
    createEmployeeRequest.properties['county_id'] = countyId;

    const serviceRequest = createEmployeeRequest as CreateUserRequest;
    serviceRequest.roles = [Role.Employee];
    const user = await this.usersService.create(serviceRequest);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      properties: user.properties,
    } as GetEmployeeResponse;
  }

  async findEmployees(countyId: string) {
    return this.usersService.find({
      'properties.county_id': countyId,
    });
  }

  async updateEmployee(
    countyId: string,
    updateEmployeeRequest: UpdateEmployeeRequest,
  ): Promise<GetEmployeeResponse> {
    updateEmployeeRequest.properties['county_id'] = countyId;

    const serviceRequest = updateEmployeeRequest as UpdateEmployeeRequest;
    serviceRequest.properties = new Map(
      Object.entries(updateEmployeeRequest.properties),
    );
    serviceRequest.roles = [Role.Employee];
    const user = await this.usersService.update(serviceRequest);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      properties: user.properties,
    } as GetEmployeeResponse;
  }

  async updateManager(
    countyId: string,
    updateEmployeeRequest: UpdateEmployeeRequest,
  ): Promise<GetEmployeeResponse> {
    updateEmployeeRequest.properties['county_id'] = countyId;

    const serviceRequest = updateEmployeeRequest as UpdateEmployeeRequest;
    serviceRequest.properties = new Map(
      Object.entries(updateEmployeeRequest.properties),
    );
    serviceRequest.roles = [Role.Manager];
    const user = await this.usersService.update(serviceRequest);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      properties: user.properties,
    } as GetEmployeeResponse;
  }

  async removeEmployee(employeeId: string) {
    return await this.usersService.remove(employeeId);
  }

  async createManager({ email, name, county_id }: CreateManagerRequest) {
    const session = await this.countyRepository.startTransaction();

    try {
      const county = await this.countyRepository.create(
        { name, county_id },
        {
          session,
        },
      );

      const properties = new Map<string, string>();
      properties.set('county_id', county._id.toString());

      const user = await this.usersService.create({
        email,
        roles: [Role.Manager],
        properties,
      });

      await lastValueFrom(
        this.notifierService.emit({
          type: 'send_email',
          message: {
            to: email,
            subject: 'Cadastro CISAB',
            body: `você deve registrar pelo link: <a href="${process.env.WEBSITE_URL}/firstAccess/${user._id}">clique aqui.</a>`,
          },
        }),
      );
      this.logger.log(`an email has been sent to manager ${user.email}`);

      await session.commitTransaction();
      this.logger.log(`county id ${county._id} saved`);

      return county;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async isManagerActive(id: Types.ObjectId) {
    const user = await this.usersService.findOneOrReturnNull({ _id: id });

    if (user.password) return true;
    return false;
  }

  async updateManagerAttributes(
    userId: Types.ObjectId,
    attributes: {
      name: string;
      surname: string;
      password: string;
      properties: Map<string, string>;
    },
  ) {
    try {
      const { name, surname, password, properties: newProperties } = attributes;

      const { _id, email, roles, properties } =
        await this.usersService.findOneOrReturnNull({ _id: userId });

      // just copy what we already have on properties and add new ones.

      for (const keyValue of newProperties) {
        properties.set(keyValue[0], keyValue[1]);
      }

      await this.usersService.update({
        _id,
        name,
        surname,
        email,
        roles,
        password,
        properties,
      });

      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
