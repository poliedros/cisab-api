import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CountiesRepository } from './counties.repository';
import { CreateCountyDto } from './dto/request/create-county.dto';
import { UpdateCountyDto } from './dto/request/update-county.dto';
import { NotifierService } from './../notifier/notifier.service';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { Role } from '../auth/role.enum';
import { CountyUserResponse } from './dto/response/county-user-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CountiesService {
  private readonly logger = new Logger(CountiesService.name);

  constructor(
    private readonly countyRepository: CountiesRepository,
    private readonly notifierService: NotifierService,
    private readonly usersService: UsersService,
  ) {}

  async create(createCountyDto: CreateCountyDto) {
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

  update(id: string, updateCountyDto: UpdateCountyDto) {
    this.logger.log(`county id: ${id} will be updated...`);
    // TODO: session here
    return this.countyRepository.findOneAndUpdate({ _id: id }, updateCountyDto);
  }

  remove(id: string) {
    this.logger.log(`county id: ${id} will be deleted...`);
    return this.countyRepository.deleteOne({ _id: id });
  }

  async createCountyUser(
    countyId: string,
    createCountyUserRequest: CreateCountyUserRequest,
  ): Promise<CountyUserResponse> {
    createCountyUserRequest.properties['county_id'] = countyId;

    const serviceRequest = createCountyUserRequest as CreateUserDto;
    serviceRequest.roles = [Role.County];
    return this.usersService.create(serviceRequest);
  }
}
