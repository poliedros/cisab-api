import { NotifierService } from './../notifier/notifier.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CountiesRepository } from './counties.repository';
import { CountiesService } from './counties.service';
import { of } from 'rxjs';
import { UsersService } from '../users/users.service';
import { CreateCountyUserRequest } from './dto/request/create-county-user-request.dto';
import { Role } from '../auth/role.enum';

function buildCounty() {
  return {
    account: {
      user: 'test',
      password: 'password',
    },
    county: {
      address: 'address',
      anniversary: '12/12/1900',
      contact: '123',
      distanceToCisab: '12',
      email: 'email@email.com',
      flag: 'flag url',
      mayor: 'osvaldo',
      name: 'New York',
      note: 'notes',
      phone: '123',
      population: '55',
      site: 'site.com',
      socialMedias: 'socialMedias url',
      state: 'state',
      zipCode: '123122-12',
    },
    accountable: {
      address: 'address',
      email: 'email@email.com',
      job: 'job',
      name: 'osvaldo',
      note: 'notes',
      phone: '12312',
      socialMedias: 'socialMedias url',
      zipCode: '123122-12',
    },
  };
}

function buildIdCountyMock() {
  const idString = '63599affb40135010840911b';
  const idStub = new Types.ObjectId(idString);
  const county = { _id: idStub, ...buildCounty() };

  return [idStub, county];
}
const emitMockFn = jest.fn();

async function buildService(
  countyRepositoryMocksValue,
  usersServiceMocksValue,
) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CountiesService,
      {
        provide: CountiesRepository,
        useValue: countyRepositoryMocksValue,
      },
      {
        provide: NotifierService,
        useValue: {
          emit: emitMockFn,
        },
      },
      {
        provide: UsersService,
        useValue: usersServiceMocksValue,
      },
    ],
  }).compile();

  return module.get<CountiesService>(CountiesService);
}

describe('CountiesService', () => {
  let service: CountiesService;
  const createMockFn = jest.fn();
  const findOneMockFn = jest.fn();
  const findMockFn = jest.fn();
  const upsertMockFn = jest.fn();
  const deleteOneMockFn = jest.fn();
  const startTransactionMockFn = jest.fn();
  const findByCountyIdMockFn = jest.fn();
  startTransactionMockFn.mockReturnValue(
    Promise.resolve({
      abortTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }),
  );

  const createCountyUserMockFn = jest.fn();

  beforeEach(async () => {
    const countyRepositoryMocksValue = {
      create: createMockFn,
      find: findMockFn,
      findOne: findOneMockFn,
      upsert: upsertMockFn,
      deleteOne: deleteOneMockFn,
      startTransaction: startTransactionMockFn,
    };

    const usersServiceMockValue = {
      create: createCountyUserMockFn,
      findByCountyId: findByCountyIdMockFn,
    };

    service = await buildService(
      countyRepositoryMocksValue,
      usersServiceMockValue,
    );
  });

  it('should create with valid data', async () => {
    const [, county] = buildIdCountyMock();

    emitMockFn.mockReturnValue(of(Promise.resolve(true)));
    createMockFn.mockReturnValue(Promise.resolve(county));

    const response = await service.create(buildCounty());

    expect(response.county.address).toEqual('address');
  });

  it('should get all counties', async () => {
    const useValue = {
      find: findMockFn,
    };
    service = await buildService(useValue, {});

    const [idStub, county] = buildIdCountyMock();
    const countiesStub = [county];

    findMockFn.mockReturnValue(Promise.resolve(countiesStub));

    const response = await service.findAll();

    expect(response[0]._id).toEqual(idStub);
  });

  it('should create a county user', async () => {
    const properties: Map<string, string> = new Map<string, string>();
    properties['profession'] = 'software engineer';
    const req: CreateCountyUserRequest = {
      email: 'carlos@czar.dev',
      name: 'carlos',
      surname: 'zansavio',
      password: 'changeme',
      properties,
    };

    createCountyUserMockFn.mockReturnValue(
      Promise.resolve({ _id: '12', ...req }),
    );

    const response = await service.createCountyUser('1', req);

    expect(response._id).toEqual('12');
    expect(response.properties['county_id']).toEqual('1');
    expect(createCountyUserMockFn.mock.calls[0][0]['roles']).toEqual([
      Role.County,
    ]);
    expect(createCountyUserMockFn).toBeCalledTimes(1);
  });

  it('should find all county users', async () => {
    const countyUser = {
      _id: '6363c4be63e9deb5a8e1c674',
      email: 'vicosa@cisab.com',
      name: 'cisab',
      surname: 'cisab',
      password: 'admin',
      properties: {
        profession: 'software developer',
      },
    };
    findByCountyIdMockFn.mockReturnValue(Promise.resolve([countyUser]));

    const countyUserRes = await service.findCountyUsers(
      '6363c2f363e9deb5a8e1c672',
    );

    expect(countyUserRes[0]._id).toEqual('6363c4be63e9deb5a8e1c674');
  });
});
