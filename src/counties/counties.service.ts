import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CountiesRepository } from './counties.repository';
import { CreateCountyRequest } from './dto/request/create-county-request.dto';
import { UpdateCountyRequest } from './dto/request/update-county-request.dto';
import { NotifierService } from './../notifier/notifier.service';
import { CreateUserRequest } from 'src/users/dtos/create-user-request.dto';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { Role } from '../auth/role.enum';
import { GetCountyUserResponse } from './dto/response/get-county-user-response.dto';
import { UsersService } from '../users/users.service';
import { UpdateCountyUserRequest } from './dto/request/update-county-user-request.dto';
import { CreateManagerRequest } from './dto/request/create-manager-request.dto';
import { Types } from 'mongoose';
import { CountyEntity } from './entities/county.entity';

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

  findAll() {
    return this.countyRepository.find({});
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

  remove(id: string) {
    this.logger.log(`county id: ${id} will be deleted...`);
    return this.countyRepository.deleteOne({ _id: id });
  }

  async createCountyUser(
    countyId: string,
    createCountyUserRequest: CreateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    createCountyUserRequest.properties['county_id'] = countyId;

    const serviceRequest = createCountyUserRequest as CreateUserRequest;
    serviceRequest.roles = [Role.County];
    const user = await this.usersService.create(serviceRequest);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      properties: user.properties,
    } as GetCountyUserResponse;
  }

  async findCountyUsers(countyId: string) {
    return this.usersService.find({
      'properties.county_id': countyId,
    });
  }

  async updateCountyUser(
    countyId: string,
    updateCountyUserRequest: UpdateCountyUserRequest,
  ): Promise<GetCountyUserResponse> {
    updateCountyUserRequest.properties['county_id'] = countyId;

    const serviceRequest = updateCountyUserRequest as UpdateCountyUserRequest;
    serviceRequest.properties = new Map(
      Object.entries(updateCountyUserRequest.properties),
    );
    const user = await this.usersService.update(serviceRequest);

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      properties: user.properties,
    } as GetCountyUserResponse;
  }

  async removeCountyUser(countyUserId: string) {
    return await this.usersService.remove(countyUserId);
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
    const user = await this.usersService.findOne({ _id: id });

    if (user.password) return true;
    return false;
  }

  async updateManagerPassword(userId: Types.ObjectId, password: string) {
    try {
      const { _id, name, surname, email, roles, properties } =
        await this.usersService.findOne({ _id: userId });

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
      return false;
    }
  }
}
